import React from 'react';
import './Details.css';
import { useContext } from 'react';
import { MovieContext } from './Movie';

const Details = () => {
    const { state } = useContext(MovieContext);
    const { movie } = state;

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const {
        budget,
        original_language,
        production_countries,
        revenue,
        status,
    } = movie;

    return (
        <>
            {movie.length !== 0 && (
                <div className='details-div'>
                    <h2 className='details-header'>Details</h2>
                    <div className='details'>
                        {status && (
                            <div>
                                <h4 className='detail-item'>Status</h4>
                                <h5 className='detail-item detail-info'>
                                    {status}
                                </h5>
                            </div>
                        )}
                        {original_language && (
                            <div>
                                <h4 className='detail-item'>
                                    Original language
                                </h4>
                                <h5 className='detail-item detail-info'>
                                    {original_language}
                                </h5>
                            </div>
                        )}
                        {production_countries && (
                            <div>
                                <h4 className='detail-item'>Countries</h4>
                                <h5 className='detail-item detail-info'>
                                    {production_countries
                                        .map((country) => country.iso_3166_1)
                                        .join(', ')}
                                </h5>
                            </div>
                        )}
                        {budget > 0 && (
                            <div>
                                <h4 className='detail-item'>Budget</h4>
                                <h5 className='detail-item detail-info'>
                                    {'$' + numberWithCommas(budget)}
                                </h5>
                            </div>
                        )}
                        {revenue > 0 && (
                            <div>
                                <h4 className='detail-item'>Revenue</h4>
                                <h5 className='detail-item detail-info'>
                                    {'$' + numberWithCommas(revenue)}
                                </h5>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Details;
