import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from './Loading';
import PersonItem from './PersonItem';
import ReviewItem from './ReviewItem';

import './Movie.css';

const Movie = () => {
    const [movie, setMovie] = useState([]);
    const [movieCredits, setMovieCredits] = useState([]);
    const [movieVideos, setMovieVideos] = useState([]);
    const [releaseDates, setReleaseDates] = useState([]);
    const [countryCode, setCountryCode] = useState([]);
    const [displayTrailer, setDisplayTrailer] = useState(false);
    const [releaseCode, setReleaseCode] = useState('');
    const [reviews, setReviews] = useState({});

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

        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '/reviews' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setReviews(data));
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

    const setDirectorValue = (movieCrew) => {
        return movieCrew
            ? movieCrew.filter((person) => person.job === 'Director')
            : '';
    };

    const setWriterValue = (movieCrew) => {
        return movieCrew
            ? movieCrew.filter(
                  (person) => person.job === 'Writer' || person.job === 'Story'
              )
            : '';
    };

    const setScreenplayValue = (movieCrew) => {
        return movieCrew
            ? movieCrew.filter((person) => person.job === 'Screenplay')
            : '';
    };

    const setCharactersValue = (movieCrew) => {
        return movieCrew
            ? movieCrew.filter((person) => person.job === 'Characters')
            : '';
    };

    const setNovelValue = (movieCrew) => {
        return movieCrew
            ? movieCrew.filter((person) => person.job === 'Novel')
            : '';
    };

    const setReleaseDateValue = (releaseDates, countryCode) => {
        const temporaryRelease =
            releaseDates &&
            countryCode &&
            (releaseDates.find(
                (release) => release.iso_3166_1 === countryCode
            ) ||
                releaseDates.find((release) => release.iso_3166_1 === 'US') ||
                releaseDates.find((release) =>
                    release.release_dates.find(
                        (rlsd) => rlsd.release_date !== null
                    )
                ));
        temporaryRelease && setReleaseCode(temporaryRelease.iso_3166_1);
        return (
            (temporaryRelease &&
                temporaryRelease.release_dates.find(
                    (release) => release.type === 3
                )) ||
            (temporaryRelease &&
                temporaryRelease.release_dates.find(
                    (release) => release.release_date
                ))
        );
    };

    const setReleaseCertificationValue = (releaseDates, countryCode) => {
        const temporaryRelease =
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

        return (
            temporaryRelease &&
            (temporaryRelease.release_dates.find(
                (release) => release.type === 3 && release.certification
            ) ||
                temporaryRelease.release_dates.find(
                    (release) => release.certification
                ))
        );
    };

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
    const director = useMemo(() => setDirectorValue(movieCredits.crew), [
        movieCredits.crew,
    ]);
    const writer = useMemo(() => setWriterValue(movieCredits.crew), [
        movieCredits.crew,
    ]);
    const screenplay = useMemo(() => setScreenplayValue(movieCredits.crew), [
        movieCredits.crew,
    ]);
    const characters = useMemo(() => setCharactersValue(movieCredits.crew), [
        movieCredits.crew,
    ]);
    const novel = useMemo(() => setNovelValue(movieCredits.crew), [
        movieCredits.crew,
    ]);
    let releaseDate = useMemo(
        () => setReleaseDateValue(releaseDates, countryCode),
        [releaseDates, countryCode]
    );

    let releaseCertification = useMemo(
        () => setReleaseCertificationValue(releaseDates, countryCode),
        [releaseDates, countryCode]
    );
    return (
        <>
            {movie ? (
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
                                {release_date && (
                                    <span className='gray'>
                                        {' (' +
                                            release_date.split('-')[0] +
                                            ')'}
                                    </span>
                                )}
                            </h1>
                            <div className='tec-info'>
                                {releaseCertification && (
                                    <>
                                        <h5 className='certification'>
                                            {releaseCertification.certification &&
                                                releaseCertification.certification}
                                        </h5>
                                        <h5>•</h5>
                                    </>
                                )}
                                {releaseDate && (
                                    <>
                                        <h5>
                                            {releaseDate.release_date.split(
                                                'T'
                                            )[0] +
                                                (releaseCode &&
                                                    ' (' + releaseCode + ')')}
                                        </h5>
                                    </>
                                )}
                                {genres && (
                                    <>
                                        <h5>•</h5>
                                        <h5>
                                            {genres
                                                .map((genre) => genre.name)
                                                .join(', ')}
                                        </h5>
                                    </>
                                )}
                                {runtime > 0 && (
                                    <>
                                        <h5>•</h5>
                                        <h5 className='runtime'>
                                            {Math.floor(runtime / 60) / 60 >
                                                0 &&
                                                Math.floor(runtime / 60) + 'h'}
                                            {(runtime % 60) + 'm'}
                                        </h5>
                                    </>
                                )}
                            </div>
                            {vote_average && (
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
                                    {movieVideos && movieVideos.length > 0 && (
                                        <h5
                                            className='watch-trailer'
                                            onClick={() =>
                                                setDisplayTrailer(true)
                                            }
                                        >
                                            <i className='fas fa-play'></i>
                                            {' Watch trailer'}
                                        </h5>
                                    )}
                                </div>
                            )}
                            <h4 className='tagline'>{tagline}</h4>
                            {overview && (
                                <pre className='description'>
                                    <h4>Overview</h4>
                                    {overview}
                                </pre>
                            )}
                            <div className='director-writer'>
                                {director.length > 0 && (
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
                    <div className='cast'>
                        {movieCredits.cast &&
                            movieCredits.cast.map((person) => {
                                const {
                                    id,
                                    name,
                                    profile_path,
                                    character,
                                } = person;
                                const profile =
                                    'https://image.tmdb.org/t/p/w500/' +
                                    profile_path;
                                return (
                                    <PersonItem
                                        key={id}
                                        id={id}
                                        name={name}
                                        profile={profile}
                                        character={character}
                                    />
                                );
                            })}
                    </div>

                    <div className='reviews'>
                        <h2 className='reviews-header'>Reviews</h2>
                        <div id='reviews-div' className='reviews-div'>
                            {reviews &&
                                reviews.results &&
                                reviews.results.map((review) => {
                                    const {
                                        author,
                                        author_details,
                                        content,
                                        created_at,
                                        id,
                                    } = review;
                                    const {
                                        avatar_path,
                                        rating,
                                    } = author_details;
                                    return (
                                        <ReviewItem
                                            author={author}
                                            avatarPath={avatar_path}
                                            content={content}
                                            createdAt={created_at}
                                            rating={rating}
                                            id={id}
                                        />
                                    );
                                })}
                        </div>
                        {reviews && reviews.results && (
                            <>
                                <button
                                    className='more-reviewsbtn-up reviewsbtn'
                                    onClick={() => {
                                        switch (
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height
                                        ) {
                                            case '40rem':
                                                document.getElementById(
                                                    'reviews-div'
                                                ).style.height = '10rem';
                                                document.getElementById(
                                                    'reviews-div'
                                                ).style.overflow = 'hidden';
                                                break;
                                            case '10rem':
                                                document.getElementById(
                                                    'reviews-div'
                                                ).style.height = '0';
                                                break;
                                            default:
                                                break;
                                        }
                                    }}
                                >
                                    <i className='fas fa-caret-up fa-1x'></i>
                                </button>
                                <button
                                    className='more-reviewsbtn-down reviewsbtn'
                                    onClick={() => {
                                        if (
                                            !document.getElementById(
                                                'reviews-div'
                                            ).style.height ||
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height === '0px'
                                        ) {
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height = '10rem';
                                        } else {
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height = '40rem';
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.overflow = 'auto';
                                        }
                                    }}
                                >
                                    <i className='fas fa-caret-down fa-1x'></i>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <Loading />
            )}
            {displayTrailer && movieVideos && movieVideos.length > 0 && (
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
