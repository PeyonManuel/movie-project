import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Tv = () => {
    const [tv, setTv] = useState([]);
    const [tvCredits, setTvCredits] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/tv/' +
                id +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setTv(data));
        fetch(
            'https://api.themoviedb.org/3/tv/' +
                id +
                '/credits' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setTvCredits(data));
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
    const {
        poster_path,
        name,
        vote_average,
        vote_count,
        release_date,
        episode_run_time,
        genres,
        tagline,
        overview,
    } = tv;
    const director = tvCredits.crew
        ? tvCredits.crew.find((person) => person.job === 'Director')
        : '';
    return (
        <>
            {tv && (
                <div className='tvcard'>
                    {poster_path && (
                        <img
                            src={
                                'https://image.tmdb.org/t/p/w500/' + poster_path
                            }
                            alt={tv.name + ' poster'}
                        />
                    )}
                    <h1>{name}</h1>
                    <div className='votediv'>
                        <h4>{vote_average}</h4>
                        <h5>{vote_count}</h5>
                    </div>
                    <div className='infodiv'>
                        <h4>{release_date}</h4>
                        <h5>{episode_run_time}</h5>
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
