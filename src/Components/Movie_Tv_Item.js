import React from 'react';
import './Movie_Tv_Item.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const MovieTvItem = ({ id, title, rating, poster, overview, mediaType }) => {
    const [posterSrc, setPosterSrc] = useState(poster);
    return (
        <div className='movietv'>
            <Link
                to={(mediaType === 'movie' ? '/movie/' : '/tv/') + id}
                className='link img'
            >
                <div className='imgdiv'>
                    <img
                        src={posterSrc}
                        alt={title + ' poster'}
                        onError={() =>
                            setPosterSrc(
                                'https://icon-library.com/images/no-photo-available-icon/no-photo-available-icon-19.jpg'
                            )
                        }
                    />
                </div>
            </Link>
            <Link to={'/movie/' + id} className='link title'>
                <h2>{title}</h2>
            </Link>
            <h3
                className={
                    'rating ' +
                    (rating
                        ? rating > 7.5
                            ? 'green'
                            : rating > 5
                            ? 'yellow'
                            : 'red'
                        : 'white')
                }
            >
                {rating ? rating : 'NYR'}
            </h3>
            <div className='overview'>
                <h4>Overview:</h4>
                {overview ? overview : '-'}
            </div>
        </div>
    );
};

export default MovieTvItem;
