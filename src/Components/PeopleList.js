import React from 'react';
import Person from './PersonItem';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../App';
import './PeopleList.css';

const MovieTvList = () => {
    const { dispatch, state } = useContext(GlobalContext);

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/person/popular?api_key=792dde4161d1a8ae31ac0fa85780d7fc&language=en-US&page=1'
        )
            .then((response) => response.json())
            .then((data) =>
                dispatch({ type: 'SET_PEOPLE', payload: data.results })
            );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ width: '99vw' }}>
            <h1 className='headlines'>Popular celebrities right now</h1>
            <div className='lists'>
                {state.people ? (
                    state.people.map((result) => {
                        const { id, name, profile_path } = result;
                        const profile =
                            'https://image.tmdb.org/t/p/w500/' + profile_path;
                        return (
                            <Person
                                key={id}
                                id={id}
                                name={name}
                                profile={profile}
                            />
                        );
                    })
                ) : (
                    <h1>Loading...</h1>
                )}
            </div>
        </div>
    );
};

export default MovieTvList;
