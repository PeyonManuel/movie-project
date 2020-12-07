import React from 'react';
import { useState, useEffect } from 'react';
import MovieTvItem from '../Movie_Tv_Item';
import './SimilarTvShows.css';

const SimilarTvShows = React.memo(({ id }) => {
    const [similarMovies, setSimilarMovies] = useState({});
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/tv/' +
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
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {similarMovies.length > 0 && (
                <>
                    <div className='smilar-tv-div'>
                        <div className='similar-header'>
                            <h2
                                onClick={() => {
                                    setSelected(0);
                                }}
                            >
                                Similar Tv shows
                            </h2>
                        </div>
                        <div
                            className={
                                selected !== 0
                                    ? 'similar-tv hide'
                                    : 'similar-tv'
                            }
                        >
                            {similarMovies.map((mov) => {
                                const {
                                    id,
                                    name,
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
                                        title={name}
                                        rating={vote_average}
                                        poster={poster}
                                        overview={overview}
                                        mediaType={'tv'}
                                    />
                                );
                            })}
                        </div>
                        <div
                            className={
                                selected !== 1
                                    ? 'collection-movies hide'
                                    : 'collection-movies'
                            }
                        ></div>
                    </div>
                </>
            )}
        </>
    );
});

export default SimilarTvShows;
