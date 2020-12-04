import React from 'react';
import { useState, useEffect } from 'react';

const SimilarMovies = ({ id }) => {
    const [similarMovies, setSimilarMovies] = useState({});
    useEffect(() => {});
    return (
        <div className='smilar-movies-div'>
            <div className='similar-movies'></div>
        </div>
    );
};

export default SimilarMovies;
