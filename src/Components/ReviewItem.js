import React from 'react';
import { useState } from 'react';
import './ReviewItem.css';

const ReviewItem = ({ author, avatarPath, content, createdAt, rating, id }) => {
    const [image, setImage] = useState(
        'https://image.tmdb.org/t/p/w500' + avatarPath
    );
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    return (
        <div className='review-item'>
            <div className='img-div'>
                <img
                    className='author-profile'
                    src={image}
                    alt={author + ' profile pic'}
                    onError={() => setImage('https://i.imgur.com/sdkYiCr.png')}
                />
            </div>
            {author && (
                <div className='author-rating'>
                    <h2>
                        {'A review by ' + author}{' '}
                        {rating && (
                            <span className='review-rating'>
                                <i className='fas fa-star fa-1x'></i>
                                {rating}
                            </span>
                        )}
                    </h2>
                    {createdAt && (
                        <h6 className='createdat'>
                            {months[parseInt(createdAt.split('-')[1])] +
                                ' ' +
                                parseInt(createdAt.split('-')[2]) +
                                ', ' +
                                parseInt(createdAt.split('-')[0])}
                        </h6>
                    )}
                </div>
            )}

            {content && (
                <pre className='content'>{content.slice(0, 450) + '...'}</pre>
            )}
        </div>
    );
};

export default ReviewItem;
