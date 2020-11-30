import React from 'react';
import { Link } from 'react-router-dom';
import './PersonItem.css';

const Person = ({ id, name, profile }) => {
    return (
        <>
            {profile && (
                <>
                    <div className='person' key={id}>
                        <Link className='link img' to={'/person/' + id}>
                            <img src={profile} alt={name + ' profile'} />
                        </Link>

                        <Link className='link name' to={'/person/' + id}>
                            <h2 className='name'>{name}</h2>
                        </Link>
                    </div>
                </>
            )}
        </>
    );
};

export default Person;
