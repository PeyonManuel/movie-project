import React from 'react';
import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { TvContext } from './Tv';
import './TvInfoCard.css';

const TvInfoCard = React.memo(({ id }) => {
    const [tvVideos, setTvVideos] = useState([]);
    const [countryCode, setCountryCode] = useState([]);
    const [contentRatings, setContentRatings] = useState([]);
    const [trailerInfo, setTrailerInfo] = useState('');
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

        fetch(
            'https://api.themoviedb.org/3/tv/' +
                id +
                '/content_ratings' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setContentRatings(data.results));

        fetch('https://ipapi.co/json/')
            .then((response) => response.json())
            .then((data) => setCountryCode(data.country_code));
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        tvVideos.length > 0 &&
            setTrailerInfo(
                tvVideos.find((video) => video.type === 'Trailer') ||
                    tvVideos.find((video) => video.type === 'Teaser') ||
                    tvVideos.find((video) => video.type && video.type)
            );
    }, [tvVideos]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        document.title = tv.name ? tv.name + ' - Moviezz' : 'Moviezz';
    }, [tv]);

    const setCreditsValue = (tvCrew, job) => {
        return tvCrew
            ? tvCrew.filter((person) =>
                  person.jobs.find((jobs) => jobs.job === job)
              )
            : '';
    };

    const {
        poster_path,
        name,
        vote_average,
        vote_count,
        first_air_date,
        episode_run_time,
        genres,
        tagline,
        overview,
    } = tv;

    const executiveProducer = useMemo(
        () => setCreditsValue(tvCredits.crew, 'Executive Producer'),
        [tvCredits.crew]
    );
    const musicComposer = useMemo(
        () => setCreditsValue(tvCredits.crew, 'Original Music Composer'),
        [tvCredits.crew]
    );
    const writer = useMemo(() => setCreditsValue(tvCredits.crew, 'Writer'), [
        tvCredits.crew,
    ]);
    const characters = useMemo(
        () => setCreditsValue(tvCredits.crew, 'Characters'),
        [tvCredits.crew]
    );
    const novel = useMemo(() => setCreditsValue(tvCredits.crew, 'Novel'), [
        tvCredits.crew,
    ]);

    const certification =
        contentRatings.find((rating) => rating.iso_3166_1 === countryCode) ||
        contentRatings.find((rating) => rating.iso_3166_1 === 'US') ||
        contentRatings.find((rating) => rating.rating && rating.rating);

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
                            {first_air_date && (
                                <span className='gray'>
                                    {' (' + first_air_date.split('-')[0] + ')'}
                                </span>
                            )}
                        </h1>
                        <div className='tec-info'>
                            {certification && (
                                <>
                                    <h5 className='certification'>
                                        {certification.rating &&
                                            certification.rating}
                                    </h5>
                                    <h5>•</h5>
                                </>
                            )}
                            {first_air_date && (
                                <>
                                    <h5>
                                        {first_air_date +
                                            (certification &&
                                                certification.iso_3166_1 &&
                                                ' (' +
                                                    certification.iso_3166_1 +
                                                    ')')}
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
                            {episode_run_time[0] > 0 && (
                                <>
                                    <h5>•</h5>
                                    <h5 className='runtime'>
                                        {Math.floor(episode_run_time[0] / 60) /
                                            60 >
                                            0 &&
                                            Math.floor(
                                                episode_run_time[0] / 60
                                            ) + 'h'}
                                        {(episode_run_time[0] % 60) + 'm'}
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
                                        id='watch-trailer'
                                        className='watch-trailer'
                                        onClick={() => setDisplayTrailer(true)}
                                    >
                                        <i className='fas fa-play'></i>
                                        {' Watch ' + trailerInfo.type}
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
                            {executiveProducer.length > 0 && (
                                <p>
                                    <b>Executive Producer </b> <br />
                                    <span>
                                        {executiveProducer
                                            .map((exec) => exec.name)
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
                            {musicComposer.length > 0 && (
                                <p>
                                    <b>Original music composer </b> <br />
                                    <span>
                                        {musicComposer
                                            .map((musc) => musc.name)
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
                            trailerInfo.key +
                            '?autoplay=1'
                        }
                        ref={wrapperRef}
                        webkitallowfullscreen='true'
                        mozallowfullscreen='true'
                        allowFullScreen
                        allow='autoplay'
                    ></iframe>
                </div>
            )}
        </>
    );
});
export default TvInfoCard;
