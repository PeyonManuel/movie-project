import React from 'react';
import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { TvContext } from './Tv';
import './TvInfoCard.css';

const TvInfoCard = React.memo(({ id }) => {
    const [tvVideos, setTvVideos] = useState([]);
    const [countryCode, setCountryCode] = useState([]);
    const [displayTrailer, setDisplayTrailer] = useState(false);
    const [displayInfo, setDisplayInfo] = useState(false);

    const { state } = useContext(TvContext);

    const { tv, tvCredits } = state;

    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplayTrailer(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/tv/' +
                id +
                '/videos' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setTvVideos(data.results));

        fetch('https://ipapi.co/json/')
            .then((response) => response.json())
            .then((data) => setCountryCode(data.country_code));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        document.title = tv.name ? tv.name + ' - Moviezz' : 'Moviezz';
    }, [tv]);

    const setDirectorValue = (tvCrew) => {
        return tvCrew
            ? tvCrew.filter((person) => person.job === 'Director')
            : '';
    };

    const setWriterValue = (tvCrew) => {
        return tvCrew
            ? tvCrew.filter(
                  (person) => person.job === 'Writer' || person.job === 'Story'
              )
            : '';
    };

    const setScreenplayValue = (tvCrew) => {
        return tvCrew
            ? tvCrew.filter((person) => person.job === 'Screenplay')
            : '';
    };

    const setCharactersValue = (tvCrew) => {
        return tvCrew
            ? tvCrew.filter((person) => person.job === 'Characters')
            : '';
    };

    const setNovelValue = (tvCrew) => {
        return tvCrew ? tvCrew.filter((person) => person.job === 'Novel') : '';
    };

    const {
        poster_path,
        name,
        vote_average,
        vote_count,
        release_date,
        runtime,
        genres,
        tagline,
        overview,
    } = tv;

    const director = useMemo(() => setDirectorValue(tvCredits.crew), [
        tvCredits.crew,
    ]);
    const writer = useMemo(() => setWriterValue(tvCredits.crew), [
        tvCredits.crew,
    ]);
    const screenplay = useMemo(() => setScreenplayValue(tvCredits.crew), [
        tvCredits.crew,
    ]);
    const characters = useMemo(() => setCharactersValue(tvCredits.crew), [
        tvCredits.crew,
    ]);
    const novel = useMemo(() => setNovelValue(tvCredits.crew), [
        tvCredits.crew,
    ]);

    return (
        <>
            <div className='img-info'>
                <div className='posterdiv'>
                    {poster_path && (
                        <img
                            src={
                                'https://image.tmdb.org/t/p/w500/' + poster_path
                            }
                            alt={name + ' poster'}
                            onLoad={() => setDisplayInfo(true)}
                        />
                    )}
                </div>
                {displayInfo && (
                    <div className='infocard'>
                        <h1 className='title'>
                            {name}
                            {release_date && (
                                <span className='gray'>
                                    {' (' + release_date.split('-')[0] + ')'}
                                </span>
                            )}
                        </h1>
                        <div className='tec-info'>
                            {/* {releaseCertification && (
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
                            )} */}
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
                                        {Math.floor(runtime / 60) / 60 > 0 &&
                                            Math.floor(runtime / 60) + 'h'}
                                        {(runtime % 60) + 'm'}
                                    </h5>
                                </>
                            )}
                        </div>
                        {vote_average > 0 ? (
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
                                {tvVideos && tvVideos.length > 0 && (
                                    <h5
                                        className='watch-trailer'
                                        onClick={() => setDisplayTrailer(true)}
                                    >
                                        <i className='fas fa-play'></i>
                                        {' Watch trailer'}
                                    </h5>
                                )}
                            </div>
                        ) : (
                            name && (
                                <div className='vote-trailer'>
                                    <div className='vote'>
                                        <i className='fas fa-star fa-2x'></i>{' '}
                                        <div className='vote-numbers'>
                                            <div className='average'>
                                                <h4
                                                    style={{
                                                        marginTop: '0.4rem',
                                                    }}
                                                >
                                                    NYR
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
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
                )}
            </div>

            {displayTrailer && tvVideos && tvVideos.length > 0 && (
                <div className='trailer-div'>
                    <iframe
                        className='trailer'
                        title='trailer'
                        src={
                            'https://www.youtube.com/embed/' +
                            (tvVideos.find((ser) => ser.type === 'Trailer')
                                .key ||
                                tvVideos.find((ser) => ser.type === 'Teaser')
                                    .key) +
                            '?autoplay=1'
                        }
                        ref={wrapperRef}
                        webkitallowfullscreen
                        mozallowfullscreen
                        allowFullScreen
                        allow='autoplay'
                    ></iframe>
                </div>
            )}
        </>
    );
});
export default TvInfoCard;
