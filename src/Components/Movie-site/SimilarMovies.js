import React from 'react';
import { useState, useEffect } from 'react';
import MovieTvItem from '../Movie_Tv_Item';
import './SimilarMovies.css';

const SimilarMovies = React.memo(({ id }) => {
    const [similarMovies, setSimilarMovies] = useState({});
    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '/similar' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => {
                const temporaryMovies = data.results
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 10);
                setSimilarMovies(temporaryMovies);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            {similarMovies.length > 0 && (
                <>
                    <div className='smilar-movies-div'>
                        <h2 className='similar-header'>Similar movies</h2>
                        <div className='similar-movies'>
                            {similarMovies.map((mov) => {
                                const {
                                    id,
                                    title,
                                    vote_average,
                                    poster_path,
                                    overview,
                                } = mov;
                                const poster =
                                    'https://image.tmdb.org/t/p/w500/' +
                                    poster_path;
                                return (
                                    <MovieTvItem
                                        key={id}
                                        id={id}
                                        title={title}
                                        rating={vote_average}
                                        poster={poster}
                                        overview={overview}
                                        mediaType={'movie'}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
});

export default SimilarMovies;
