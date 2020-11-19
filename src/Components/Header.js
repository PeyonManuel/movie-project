import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [options, setOptions] = useState([]);
    const [displayOptions, setDisplayOptions] = useState(false);
    const [search, setSearch] = useState('');

    const wrapperRef = useRef(null);

    const handleClickOutside = (event) => {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(event.target)) {
            setDisplayOptions(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchBarClick = () => {
        if (displayOptions === false) setDisplayOptions(true);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (search.length > 0) {
            fetch(
                'https://api.themoviedb.org/3/search/multi?api_key=' +
                    '792dde4161d1a8ae31ac0fa85780d7fc' +
                    '&language=en-US&query=' +
                    search +
                    '&page=1&include_adult=false'
            )
                .then((response) => response.json())
                .then((data) => setOptions(data.results.slice(0, 10)));
        } else setOptions([]);
    }, [search]);

    useEffect(() => {
        if (options.length > 0) setDisplayOptions(true);
    }, [options]);

    return (
        <>
            <div className='header'>
                <Link to='/' className='logo'>
                    <img
                        src='https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png'
                        alt='popcorn'
                    />
                    <h1>Moviezz</h1>
                </Link>
                <div className='searchdiv' ref={wrapperRef}>
                    <div className='searchbar'>
                        <input
                            className='search'
                            type='text'
                            placeholder='Search...'
                            onChange={(e) => handleSearchChange(e)}
                            onClick={() => handleSearchBarClick()}
                        />
                        <a className='searchbtn' href='asd'>
                            <i className='icon fas fa-search fa-lg'></i>
                        </a>
                    </div>
                    {displayOptions > 0 && (
                        <div className='autocontainer'>
                            {options.map((result) => {
                                const {
                                    id,
                                    name,
                                    title,
                                    media_type,
                                    profile_path,
                                    poster_path,
                                } = result;
                                const poster = poster_path
                                    ? 'https://image.tmdb.org/t/p/w500/' +
                                      poster_path
                                    : 'https://www.kindpng.com/picc/m/1-10251_cinema-movie-icon-png-transparent-png.png';
                                const profile = profile_path
                                    ? 'https://image.tmdb.org/t/p/w500/' +
                                      profile_path
                                    : 'https://cdn.onlinewebfonts.com/svg/img_957.png';

                                return media_type === 'movie' ? (
                                    <div className='result' key={id}>
                                        <img src={poster} alt='' />
                                        <h2>{title}</h2>
                                        <p>
                                            {media_type
                                                .charAt(0)
                                                .toUpperCase() +
                                                media_type.slice(1)}
                                        </p>
                                    </div>
                                ) : media_type === 'tv' ? (
                                    <div className='result' key={id}>
                                        <img src={poster} alt='' />
                                        <h2>{name}</h2>
                                        <p>
                                            {media_type
                                                .charAt(0)
                                                .toUpperCase() +
                                                media_type.slice(1)}
                                        </p>
                                    </div>
                                ) : (
                                    <div className='result' key={id}>
                                        <img src={profile} alt='' />
                                        <h2>{name}</h2>
                                        <p>
                                            {media_type
                                                .charAt(0)
                                                .toUpperCase() +
                                                media_type.slice(1)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
