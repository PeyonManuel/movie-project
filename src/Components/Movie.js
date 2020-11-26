import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import './Movie.css';

const Movie = () => {
    const [movie, setMovie] = useState([]);
    const [movieCredits, setMovieCredits] = useState([]);
    const [movieVideos, setMovieVideos] = useState([]);
    const [releaseDates, setReleaseDates] = useState([]);
    const [countryCode, setCountryCode] = useState([]);

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

        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '/videos' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setMovieVideos(data));
        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '/release_dates' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setReleaseDates(data.results));

        fetch('https://ipapi.co/json/')
            .then((response) => response.json())
            .then((data) => setCountryCode(data.country_code));
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        document.title = movie.title ? movie.title + ' - Moviezz' : 'Moviezz';
    }, [movie]);

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

    const countryReleaseDate =
        releaseDates &&
        countryCode &&
        releaseDates.find((release) => release.iso_3166_1 === countryCode);

    const usReleaseDate =
        releaseDates &&
        countryCode &&
        releaseDates.find((release) => release.iso_3166_1 === 'US');

    const countryReleaseInfo =
        countryReleaseDate &&
        countryReleaseDate.release_dates.find((release) => release.type === 3);

    const usReleaseInfo =
        usReleaseDate &&
        usReleaseDate.release_dates.find((release) => release.type === 3);

    return (
        <>
            {poster_path ? (
                <div className='moviecard'>
                    <div className='img-info'>
                        {poster_path && (
                            <img
                                src={
                                    'https://image.tmdb.org/t/p/w500/' +
                                    poster_path
                                }
                                alt={title + ' poster'}
                            />
                        )}
                        <div className='infocard'>
                            <h1 className='title'>
                                {title}
                                <span className='gray'>
                                    {' (' + release_date.split('-')[0] + ')'}
                                </span>
                            </h1>
                            <div className='tec-info'>
                                <h5 className='certification'>
                                    {countryReleaseInfo &&
                                        (countryReleaseInfo.certification
                                            ? countryReleaseInfo.certification
                                            : usReleaseInfo &&
                                              usReleaseInfo.certification)}
                                </h5>
                                <h5>
                                    {countryReleaseInfo &&
                                        countryReleaseInfo.release_date.split(
                                            'T'
                                        )[0] +
                                            (countryCode &&
                                                ' (' + countryCode + ')')}
                                </h5>

                                {genres &&
                                    genres.map((genre) => (
                                        <h5 key={genre.id}>{genre.name}</h5>
                                    ))}
                                <h5 className='runtime'>
                                    {Math.floor(runtime / 60) / 60 > 0 &&
                                        Math.floor(runtime / 60) + 'h'}{' '}
                                    {(runtime % 60) + 'm'}
                                </h5>
                            </div>
                            <div className='vote-trailer'>
                                <div className='vote'>
                                    <i className='fas fa-star fa-2x'></i>{' '}
                                    <div className='vote-numbers'>
                                        <div className='average'>
                                            <h4>{' ' + vote_average}</h4>
                                            <p>/10</p>
                                        </div>
                                        <p>{vote_count}</p>
                                    </div>
                                </div>
                                <h5 className='trailer'>
                                    <i className='fas fa-play'></i>
                                    {' Watch trailer'}
                                </h5>
                            </div>

                            {director && <h2>{director.name}</h2>}
                            <h3>{tagline}</h3>
                            <p>{overview}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
};

export default Movie;
