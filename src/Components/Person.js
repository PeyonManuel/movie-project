import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieTvItem from './Movie_Tv_Item';
import './Person.css';

const Person = () => {
    const [person, setPerson] = useState([]);
    const [personCredits, setPersonCredits] = useState([]);
    const { id } = useParams();

    const getAge = (dateString) => {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        document.title = person.name ? person.name + ' - Moviezz' : 'Moviezz';
    }, [person]);

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/person/' +
                id +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setPerson(data));

        fetch(
            'https://api.themoviedb.org/3/person/' +
                id +
                '/combined_credits' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setPersonCredits(data));
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
    const {
        profile_path,
        name,
        birthday,
        deathday,
        gender,
        known_for_department,
        biography,
        also_known_as,
    } = person;

    let { cast, crew } = personCredits;
    cast &&
        cast.sort((a, b) => {
            return (
                (b.release_date
                    ? new Date(b.release_date).getTime()
                    : b.first_air_date
                    ? new Date(b.first_air_date).getTime()
                    : 999999999999999999999999) -
                (a.release_date
                    ? new Date(a.release_date).getTime()
                    : a.first_air_date
                    ? new Date(a.first_air_date).getTime()
                    : 9999999999999999999999999)
            );
        });

    crew &&
        crew.sort((a, b) => {
            return (
                (b.release_date
                    ? new Date(b.release_date).getTime()
                    : b.first_air_date
                    ? new Date(b.first_air_date).getTime()
                    : 999999999999999999999999) -
                (a.release_date
                    ? new Date(a.release_date).getTime()
                    : a.first_air_date
                    ? new Date(a.first_air_date).getTime()
                    : 9999999999999999999999999)
            );
        });
    let filmographyNoDups = [];
    cast &&
        crew &&
        [...cast, ...crew].map((film, index) => {
            !filmographyNoDups.find(
                (filmographyItem) => film.id === filmographyItem.id
            ) && filmographyNoDups.push(film);
            return '';
        });
    filmographyNoDups &&
        filmographyNoDups.sort((a, b) => b.popularity - a.popularity);

    let filmography = cast && crew && [...cast, ...crew];

    let filmographyDepartmentsArray =
        filmography && filmography.map((item) => item.department || 'Acting');

    filmographyDepartmentsArray = filmographyDepartmentsArray && [
        ...new Set(filmographyDepartmentsArray),
    ];
    let filmographyDepartmentsObject = {};
    if (filmographyDepartmentsArray)
        for (let i = 0; i < filmographyDepartmentsArray.length; i++) {
            filmographyDepartmentsObject[filmographyDepartmentsArray[i]] = [];
        }

    filmography &&
        filmography.map((item) => {
            const department = item.department || 'Acting';
            const findingDepartment = filmographyDepartmentsObject[
                department
            ].find(
                (department) =>
                    department.id === item.id &&
                    department.mediaType === item.media_type
            );
            return findingDepartment
                ? filmographyDepartmentsObject[department][
                      filmographyDepartmentsObject[department].indexOf(
                          findingDepartment
                      )
                  ].job.push(item.job || item.character || 'Unknown')
                : filmographyDepartmentsObject[department].push({
                      id: item.id,
                      mediaType: item.media_type,
                      title: item.title || item.name || '-',
                      release: item.release_date || item.first_air_date,
                      job: [item.job || item.character || 'Unknown'],
                      episodeCount: item.episode_count,
                  });
        });

    return (
        <>
            {profile_path ? (
                <>
                    <div className='personcard'>
                        <div className='imginfo'>
                            {profile_path && (
                                <img
                                    src={
                                        'https://image.tmdb.org/t/p/w500/' +
                                        profile_path
                                    }
                                    alt={person.title + ' poster'}
                                />
                            )}
                            <div className='infodiv'>
                                <h4 key='h4birth'>{'Birth date: '}</h4>
                                <h5 key='h5birth'>
                                    {birthday
                                        ? birthday +
                                          ' (' +
                                          getAge(birthday) +
                                          ' Years)'
                                        : '-'}
                                </h5>
                                {deathday && (
                                    <h5>{'Day of death: ' + deathday}</h5>
                                )}
                                <h4 key='h4death'>{'Gender: '}</h4>
                                <h5 key='h5death'>
                                    {gender
                                        ? gender === 1
                                            ? 'Female'
                                            : 'Male'
                                        : '-'}
                                </h5>
                                <h4 key='h4known'>{'Known for: '}</h4>
                                <h5 key='h5known'>
                                    {known_for_department
                                        ? known_for_department
                                        : '-'}
                                </h5>
                                <h4 key='h4also'>{'Also known as: '}</h4>
                                {also_known_as
                                    ? also_known_as.map((known) => (
                                          <h5 key={known}>{known}</h5>
                                      ))
                                    : '-'}
                            </div>
                        </div>
                        <h1 className='name'>{name}</h1>
                        <div>
                            <div className='biography'>
                                <h4>Biography: </h4>
                                <p>
                                    {biography
                                        ? biography
                                        : 'We dont have a biography for ' +
                                          name}
                                </p>
                            </div>
                            <div className='filmography'>
                                <h2>Filmography</h2>
                                <div className='lists'>
                                    {filmographyNoDups ? (
                                        filmographyNoDups.map((result) => {
                                            const {
                                                id,
                                                title,
                                                name,
                                                vote_average,
                                                poster_path,
                                                overview,
                                                media_type,
                                            } = result;
                                            const poster =
                                                'https://image.tmdb.org/t/p/w500/' +
                                                poster_path;
                                            return (
                                                <>
                                                    <MovieTvItem
                                                        key={id}
                                                        id={id}
                                                        title={title || name}
                                                        rating={vote_average}
                                                        poster={poster}
                                                        overview={overview}
                                                        mediaType={media_type}
                                                    />
                                                </>
                                            );
                                        })
                                    ) : (
                                        <h1>Loading...</h1>
                                    )}
                                </div>
                            </div>
                            <div>
                                {filmographyDepartmentsArray &&
                                    filmographyDepartmentsArray.map(
                                        (department) => (
                                            <>
                                                <h2>{department}</h2>{' '}
                                                {filmographyDepartmentsObject[
                                                    department
                                                ].map((departmentItem, i) => {
                                                    const {
                                                        title,
                                                        release,
                                                        job,
                                                        episodeCount,
                                                    } = departmentItem;
                                                    return (
                                                        <p key={i}>
                                                            {(release
                                                                ? release.split(
                                                                      '-'
                                                                  )[0]
                                                                : 'TBA') +
                                                                ' - '}{' '}
                                                            <b>{title}</b>
                                                            {episodeCount &&
                                                                ' (' +
                                                                    episodeCount +
                                                                    (episodeCount >
                                                                    1
                                                                        ? ' Episodes)'
                                                                        : ' Episode)')}
                                                            {(department !==
                                                            'Acting'
                                                                ? ' ... '
                                                                : ' as ') +
                                                                job.join(', ')}
                                                        </p>
                                                    );
                                                })}
                                            </>
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
};

export default Person;
