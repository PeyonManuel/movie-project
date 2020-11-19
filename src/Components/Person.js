import React from 'react';
import './Person.css';
const Person = ({ id, name, profile }) => {
    return (
        <div className='person' key={id}>
            <img src={profile} alt={name + ' profile'} />
            <h2 className='name'>{name}</h2>
        </div>
    );
};

export default Person;
