import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PersonItem.css';

const Person = ({ id, name, profile }) => {
    const [profilePath, setProfilePath] = useState(profile);
    return (
        <>
            {id && (
                <>
                    <div className='person' key={id}>
                        <Link className='link img' to={'/person/' + id}>
                            <img
                                src={profilePath}
                                alt={name + ' profile'}
                                onError={() =>
                                    setProfilePath(
                                        'https://i.imgur.com/sdkYiCr.png'
                                    )
                                }
                            />
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
