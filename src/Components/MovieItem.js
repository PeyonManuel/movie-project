import React from 'react';
import './MovieItem.css';
const Movie = ({ id, title, rating, poster, overview }) => {
    return (
        <div className='movie' key={id}>
            <img src={poster} alt={title + ' poster'} />
            <h2 className='title'>{title}</h2>
            <h3
                className={
                    'rating ' +
                    (rating > 7.5 ? 'green' : rating > 5 ? 'yellow' : 'red')
                }
            >
                {rating}
            </h3>
            <div className='overview'>
                <h4>Overview:</h4>
                {overview}
            </div>
        </div>
    );
};

export default Movie;
