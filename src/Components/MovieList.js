import React from 'react';
import MovieItem from './MovieItem';
import './MovieList.css';
const MovieList = () => {
    return (
        <div className='movies'>
            <MovieItem />
        </div>
    );
};

export default MovieList;
