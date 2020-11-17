import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <>
            <div className='header'>
                <div className='logo'>
                    <img
                        src='https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png'
                        alt='popcorn'
                    />
                    <h1>Moviezz</h1>
                </div>

                <div className='searchbar'>
                    <input className='search' type='text' />
                    <a className='searchbtn' href='asd'>
                        <i className='icon fas fa-search fa-lg'></i>
                    </a>
                </div>
            </div>
        </>
    );
};

export default Header;
