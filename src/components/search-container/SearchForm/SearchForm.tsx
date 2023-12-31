import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {useForm} from "react-hook-form";

import css from './SearchForm.module.css';
import {IMovie} from "../../../interfaces";
import {moviesService} from "../../../services";
import {SearchMovies} from "../SeacrhMovies";
import {Pagination} from "../../pagination-container";

const SearchForm = () => {
    const {register, handleSubmit, reset} = useForm();
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [totalPages, setTotalPages] = useState<number>();
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useSearchParams({page: '1'});

    useEffect(() => {
        if (!query.get('query')) {
            moviesService.getAll(query.get('page')).then(({data}) => {
                setMovies(data.results);
                setTotalPages(data.total_pages);
                setCurrentPage(data.page);
            })
        } else {
            moviesService.getSearchMovies(query.get('page'), query.get('query')).then(({data}) => {
                setMovies(data.results);
                setTotalPages(data.total_pages);
                setCurrentPage(data.page);
            })
        }
    }, [query]);

    const searchMovies = (value: { search: string }) => {
        setQuery((prev) => {
            prev.set('query', value.search);
            prev.set('page', '1');
            return prev;
        })

        reset();
    }

    return (
        <div className={css.SearchForm}>
            <form onSubmit={handleSubmit(searchMovies)} id={'form'}>
                <input placeholder={'Enter the name of the movie'} {...register('search')}/>
                <button>Search</button>
            </form>
            <div className={css.SearchForm_container}>
                {movies && movies.map((movie) => <SearchMovies key={movie.id} movie={movie}/>)}
            </div>
            {<Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} setQuery={setQuery} totalPages={totalPages}/>}
        </div>
    );
};

export {SearchForm};