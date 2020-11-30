import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import './Movie.css';

const Movie = () => {
    const [movie, setMovie] = useState([]);
    const [movieCredits, setMovieCredits] = useState([]);
    const [movieVideos, setMovieVideos] = useState([]);
    const [releaseDates, setReleaseDates] = useState([]);
    const [countryCode, setCountryCode] = useState([]);
    const [displayTrailer, setDisplayTrailer] = useState(false);

    const { id } = useParams();

    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplayTrailer(false);
        }
    };

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
            .then((data) => setMovieVideos(data.results));
        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '/release_dates' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => {
                setReleaseDates(data.results);
            });

        fetch('https://ipapi.co/json/')
            .then((response) => response.json())
            .then((data) => setCountryCode(data.country_code));
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        document.title = movie.title ? movie.title + ' - Moviezz' : 'Moviezz';
    }, [movie]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        ? movieCredits.crew.filter((person) => person.job === 'Director')
        : '';
    const writer = movieCredits.crew
        ? movieCredits.crew.filter(
              (person) => person.job === 'Writing' || person.job === 'Story'
          )
        : '';
    const screenplay = movieCredits.crew
        ? movieCredits.crew.filter((person) => person.job === 'Screenplay')
        : '';
    const characters = movieCredits.crew
        ? movieCredits.crew.filter((person) => person.job === 'Characters')
        : '';
    const novel = movieCredits.crew
        ? movieCredits.crew.filter((person) => person.job === 'Novel')
        : '';
    let releaseDate =
        releaseDates &&
        countryCode &&
        (releaseDates.find((release) => release.iso_3166_1 === countryCode) ||
            releaseDates.find((release) => release.iso_3166_1 === 'US') ||
            releaseDates.find((release) =>
                release.release_dates.find((rlsd) => rlsd.release_date !== null)
            ));

    const releaseCode = releaseDate && releaseDate.iso_3166_1;

    releaseDate =
        releaseDate &&
        (releaseDate.release_dates.find((release) => release.type === 3) ||
            releaseDate.release_dates.find((release) => release.release_date));

    let releaseCertification =
        releaseDates &&
        countryCode &&
        (releaseDates.find(
            (release) =>
                release.iso_3166_1 === countryCode &&
                release.release_dates.find((rlsd) => rlsd.certification)
        ) ||
            releaseDates.find(
                (release) =>
                    release.iso_3166_1 === 'US' &&
                    release.release_dates.find((rlsd) => rlsd.certification)
            ) ||
            releaseDates.find((release) =>
                release.release_dates.find((rlsd) => rlsd.certification)
            ));

    releaseCertification =
        releaseCertification &&
        (releaseCertification.release_dates.find(
            (release) => release.type === 3
        ) ||
            releaseCertification.release_dates.find(
                (release) => release.certification
            ));
    return (
        <>
            {poster_path ? (
                <div className='moviecard'>
                    <div className='img-info'>
                        <div className='posterdiv'>
                            {poster_path && (
                                <img
                                    src={
                                        'https://image.tmdb.org/t/p/w500/' +
                                        poster_path
                                    }
                                    alt={title + ' poster'}
                                />
                            )}
                        </div>
                        <div className='infocard'>
                            <h1 className='title'>
                                {title}
                                <span className='gray'>
                                    {' (' + release_date.split('-')[0] + ')'}
                                </span>
                            </h1>
                            <div className='tec-info'>
                                <h5 className='certification'>
                                    {releaseCertification &&
                                        releaseCertification.certification &&
                                        releaseCertification.certification}
                                </h5>
                                <h5>•</h5>
                                <h5>
                                    {releaseDate &&
                                        releaseDate.release_date.split('T')[0] +
                                            (releaseCode &&
                                                ' (' + releaseCode + ')')}
                                </h5>
                                <h5>•</h5>
                                <h5>
                                    {genres &&
                                        genres
                                            .map((genre) => genre.name)
                                            .join(', ')}
                                </h5>
                                <h5>•</h5>
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
                                <h5
                                    className='watch-trailer'
                                    onClick={() => setDisplayTrailer(true)}
                                >
                                    <i className='fas fa-play'></i>
                                    {' Watch trailer'}
                                </h5>
                            </div>
                            <h4 className='tagline'>{tagline}</h4>
                            <pre className='description'>
                                <h4>Overview</h4>
                                {overview}
                            </pre>
                            <div className='director-writer'>
                                {director && (
                                    <p>
                                        <b>Director </b> <br />
                                        <span>
                                            {director
                                                .map((dir) => dir.name)
                                                .join(', ')}
                                        </span>
                                    </p>
                                )}
                                {writer.length > 0 && (
                                    <p>
                                        <b>Writer </b> <br />
                                        <span>
                                            {writer
                                                .map((wri) => wri.name)
                                                .join(', ')}
                                        </span>
                                    </p>
                                )}
                                {screenplay.length > 0 && (
                                    <p>
                                        <b>Screenplay </b> <br />
                                        <span>
                                            {screenplay
                                                .map((scr) => scr.name)
                                                .join(', ')}
                                        </span>
                                    </p>
                                )}
                                {characters.length > 0 && (
                                    <p>
                                        <b>Characters </b> <br />
                                        <span>
                                            {characters
                                                .map((char) => char.name)
                                                .join(', ')}
                                        </span>
                                    </p>
                                )}
                                {novel.length > 0 && (
                                    <p>
                                        <b>Novel </b> <br />
                                        <span>
                                            {novel
                                                .map((nov) => nov.name)
                                                .join(', ')}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
            {displayTrailer && movieVideos && (
                <div className='trailer-div'>
                    <iframe
                        className='trailer'
                        title='trailer'
                        src={
                            'https://www.youtube.com/embed/' +
                            (movieVideos.find((mov) => mov.type === 'Trailer')
                                .key ||
                                movieVideos.find((mov) => mov.type === 'Teaser')
                                    .key) +
                            '?autoplay=1'
                        }
                        ref={wrapperRef}
                        webkitallowFullScreen
                        mozallowFullScreen
                        allowFullScreen
                        allow='autoplay'
                    ></iframe>
                </div>
            )}
        </>
    );
};

export default Movie;
