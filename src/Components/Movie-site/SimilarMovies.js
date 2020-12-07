import React from 'react';
import { useState, useEffect, useContext } from 'react';
import MovieTvItem from '../Movie_Tv_Item';
import './SimilarMovies.css';
import { MovieContext } from './Movie';

const SimilarMovies = React.memo(({ id }) => {
    const [similarMovies, setSimilarMovies] = useState([]);
    const [collectionMovies, setCollectionMovies] = useState([]);
    const [selected, setSelected] = useState(0);
    const [loadedCollection, setLoadedCollection] = useState(false);

    const { state } = useContext(MovieContext);
    const { belongs_to_collection } = state.movie;

    useEffect(() => {
        setSelected(0);
        setLoadedCollection(false);
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
                console.log('fetching');
            });
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if ((!loadedCollection && selected === 1) || similarMovies.length < 0) {
            fetch(
                'https://api.themoviedb.org/3/collection/' +
                    belongs_to_collection.id +
                    '?api_key=' +
                    '792dde4161d1a8ae31ac0fa85780d7fc' +
                    '&language=en-US'
            )
                .then((response) => response.json())
                .then((data) => {
                    setCollectionMovies(data.parts);
                    setLoadedCollection(true);
                });
        }
    }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            {similarMovies.length > 0 && (
                <>
                    <div className='smilar-movies-div'>
                        <div className='similar-header'>
                            <h2
                                className={
                                    belongs_to_collection && selected === 0
                                        ? 'selectedop'
                                        : ''
                                }
                                onClick={() => {
                                    setSelected(0);
                                }}
                            >
                                Similar movies
                            </h2>
                            {belongs_to_collection && (
                                <h2
                                    className={
                                        selected === 1 ? 'selectedop' : ''
                                    }
                                    onClick={() => {
                                        setSelected(1);
                                    }}
                                >
                                    {belongs_to_collection.name}
                                </h2>
                            )}
                        </div>
                        <div
                            className={
                                selected !== 0
                                    ? 'similar-movies hide'
                                    : 'similar-movies'
                            }
                        >
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
                        <div
                            className={
                                selected !== 1
                                    ? 'collection-movies hide'
                                    : 'collection-movies'
                            }
                        >
                            {collectionMovies.map((mov) => {
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
