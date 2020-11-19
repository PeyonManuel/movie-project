import React from 'react';
import './Movie_Tv_Item.css';
import { Link } from 'react-router-dom';
const MovieTvItem = ({ id, title, rating, poster, overview }) => {
    return (
        <div className='movietv'>
            <Link to={'/movies/' + id} className='link img'>
                <img src={poster} alt={title + ' poster'} />
            </Link>
            <Link to={'/movies/' + id} className='link title'>
                <h2>{title}</h2>
            </Link>
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

export default MovieTvItem;
