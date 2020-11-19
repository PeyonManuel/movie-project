import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Movie = () => {
    const [movie, setMovie] = useState([]);
    const [movieCredits, setMovieCredits] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setMovie(data));

        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '/credits' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setMovieCredits(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const {
        poster_path,
        title,
        vote_average,
        vote_count,
        release_date,
        runtime,
        genres,
        tagline,
        overview,
    } = movie;
    const director = movieCredits.crew
        ? movieCredits.crew.find((person) => person.job === 'Director')
        : '';
    return (
        <>
            {movie && (
                <div className='moviecard'>
                    {poster_path && (
                        <img
                            src={
                                'https://image.tmdb.org/t/p/w500/' + poster_path
                            }
                            alt={movie.title + ' poster'}
                        />
                    )}
                    <h1>{title}</h1>
                    <div className='votediv'>
                        <h4>{vote_average}</h4>
                        <h5>{vote_count}</h5>
                    </div>
                    <div className='infodiv'>
                        <h4>{release_date}</h4>
                        <h5>{runtime}</h5>
                        {genres &&
                            genres.map((genre) => (
                                <h6 key={genre.key}>{genre.name}</h6>
                            ))}
                    </div>
                    <h2>{director.name}</h2>
                    <h3>{tagline}</h3>
                    <p>{overview}</p>
                </div>
            )}
        </>
    );
};

export default Movie;
