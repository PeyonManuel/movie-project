import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PersonItem.css';

const Person = React.memo(({ id, name, profile, character, episodeCount }) => {
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
                        <div className='name-character'>
                            <Link className='link name' to={'/person/' + id}>
                                <h2 className='name'>{name}</h2>
                            </Link>
                            {character && (
                                <h3 className='character'>
                                    {character.length > 30
                                        ? character.slice(0, 30) + '...'
                                        : character}
                                </h3>
                            )}
                            {episodeCount && (
                                <h4 className='tv-episode-count'>
                                    {' '}
                                    {'Episode count (' + episodeCount + ')'}
                                </h4>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
});

export default Person;
