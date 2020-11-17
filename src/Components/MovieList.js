import React from 'react';
import MovieItem from './MovieItem';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../App';
import './MovieList.css';

const MovieList = () => {
    const { dispatch, state } = useContext(GlobalContext);

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/movie/popular?api_key=792dde4161d1a8ae31ac0fa85780d7fc&language=en-US&page=1'
        )
            .then((response) => response.json())
            .then((data) =>
                dispatch({ type: 'SET_RESULTS', payload: data.results })
            );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='movies'>
            {state.results ? (
                state.results.map((result) => {
                    const { id, title, vote_average, poster_path } = result;
                    const poster =
                        'https://image.tmdb.org/t/p/w500/' + poster_path;
                    return (
                        <MovieItem
                            key={id}
                            id={id}
                            title={title}
                            rating={vote_average}
                            poster={poster}
                        />
                    );
                })
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
};

export default MovieList;
