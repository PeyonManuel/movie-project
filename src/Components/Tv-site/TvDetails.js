import React from 'react';
import './TvDetails.css';
import { useContext } from 'react';
import { TvContext } from './Tv';

const TvDetails = React.memo(() => {
    const { state } = useContext(TvContext);
    const { tv } = state;

    const {
        original_language,
        production_countries,
        status,
        number_of_seasons,
        number_of_episodes,
    } = tv;

    return (
        <>
            {tv.length !== 0 && (
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
                        {production_countries.length > 0 && (
                            <div>
                                <h4 className='detail-item'>Countries</h4>
                                <h5 className='detail-item detail-info'>
                                    {production_countries
                                        .map((country) => country.iso_3166_1)
                                        .join(', ')}
                                </h5>
                            </div>
                        )}
                        {number_of_seasons && (
                            <div>
                                <h4 className='detail-item'>
                                    Number of seasons
                                </h4>
                                <h5 className='detail-item detail-info'>
                                    {number_of_seasons}
                                </h5>
                            </div>
                        )}
                        {number_of_episodes && (
                            <div>
                                <h4 className='detail-item'>
                                    Number of episodes
                                </h4>
                                <h5 className='detail-item detail-info'>
                                    {number_of_episodes}
                                </h5>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
});

export default TvDetails;
