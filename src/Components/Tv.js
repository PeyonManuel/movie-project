import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Tv.css';

const Tv = () => {
    const [movie, setMovie] = useState([]);
    const [movieCredits, setMovieCredits] = useState([]);
    const { id, mediaType } = useParams();

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/' +
                mediaType +
                '/' +
                id +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setMovie(data));

        fetch(
            'https://api.themoviedb.org/3/' +
                mediaType +
                '/' +
                id +
                '/credits' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setMovieCredits(data));
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
    const {
        poster_path,
        title,
        name,
        vote_average,
        vote_count,
        release_date,
        first_air_date,
        runtime,
        episode_run_time,
        genres,
        tagline,
        overview,
    } = movie;
    const director = movieCredits.crew
        ? movieCredits.crew.find((person) => person.job === 'Director')
        : '';
    return (
        <>
            {poster_path && (
                <div className='moviecard'>
                    {poster_path && (
                        <img
                            src={
                                'https://image.tmdb.org/t/p/w500/' + poster_path
                            }
                            alt={title || name + ' poster'}
                        />
                    )}
                    <h1>{title || name}</h1>
                    <div className='movietvvotediv'>
                        <h4>{vote_average}</h4>
                        <h5>{vote_count}</h5>
                    </div>
                    <div className='movietvinfodiv'>
                        <h4>{release_date || first_air_date}</h4>
                        <h5>
                            {runtime ||
                                (episode_run_time &&
                                    (episode_run_time.constructor === Array
                                        ? episode_run_time.join(' - ')
                                        : episode_run_time))}
                        </h5>
                        {genres &&
                            genres.map((genre) => (
                                <h6 key={genre.key}>{genre.name}</h6>
                            ))}
                    </div>
                    {director && <h2>{director.name}</h2>}
                    <h3>{tagline}</h3>
                    <p>{overview}</p>
                </div>
            )}
        </>
    );
};

export default Tv;
