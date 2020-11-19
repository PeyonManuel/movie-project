import React from 'react';
import MovieTvItem from './Movie_Tv_Item';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../App';
import './Movie_tvlist.css';

const MovieTvList = () => {
    const { dispatch, state } = useContext(GlobalContext);

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/movie/popular?api_key=792dde4161d1a8ae31ac0fa85780d7fc&language=en-US&page=1'
        )
            .then((response) => response.json())
            .then((data) =>
                dispatch({ type: 'SET_MOVIES', payload: data.results })
            );
        fetch(
            'https://api.themoviedb.org/3/tv/popular?api_key=792dde4161d1a8ae31ac0fa85780d7fc&language=en-US&page=1'
        )
            .then((response) => response.json())
            .then((data) =>
                dispatch({ type: 'SET_TV', payload: data.results })
            );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <h1 className='headlines'>Popular movies right now</h1>
            <div className='lists'>
                {state.movies ? (
                    state.movies.map((result) => {
                        const {
                            id,
                            title,
                            vote_average,
                            poster_path,
                            overview,
                        } = result;
                        const poster =
                            'https://image.tmdb.org/t/p/w500/' + poster_path;
                        return (
                            <MovieTvItem
                                key={id}
                                id={id}
                                title={title}
                                rating={vote_average}
                                poster={poster}
                                overview={overview}
                            />
                        );
                    })
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>
            <h1 className='headlines'>Popular tv shows right now</h1>
            <div className='lists'>
                {state.tv ? (
                    state.tv.map((result) => {
                        const {
                            id,
                            name,
                            vote_average,
                            poster_path,
                            overview,
                        } = result;
                        const poster =
                            'https://image.tmdb.org/t/p/w500/' + poster_path;
                        return (
                            <MovieTvItem
                                key={id}
                                id={id}
                                title={name}
                                rating={vote_average}
                                poster={poster}
                                overview={overview}
                            />
                        );
                    })
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>
        </div>
    );
};

export default MovieTvList;
