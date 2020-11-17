import React from 'react';
import './MovieItem.css';
const Movie = ({ id, title, rating, poster }) => {
    return (
        <div className='movie' key={id}>
            <img src={poster} alt={title + ' poster'} />
            <h2 className='title'>{title}</h2>
            <h3 className='rating'>{rating}</h3>
        </div>
    );
};

export default Movie;
