import React from 'react';
import { useState, useEffect } from 'react';
import './ReviewItem.css';
import Marked from 'marked';

const ReviewItem = ({
    author,
    avatarPath,
    content,
    createdAt,
    rating,
    id,
    index,
    size,
}) => {
    const [image, setImage] = useState(
        'https://image.tmdb.org/t/p/w500' + avatarPath
    );
    const [readMore, setReadMore] = useState(false);

    const setSizeToFirstThreeReviewsSize = () => {
        const childNodes = document.querySelectorAll('.reviews-div')[0]
            .childNodes;
        let acumulator = 0;
        for (let i = 0; i < 3; i++) {
            acumulator += childNodes[i] ? childNodes[i].clientHeight : 0;
        }
        document.getElementById('reviews-div').style.height =
            acumulator.toString() + 'px';
    };

    const setSizeToFirstReviewSize = () => {
        document.getElementById('reviews-div').style.height =
            document
                .querySelectorAll('.reviews-div')[0]
                .childNodes[0].clientHeight.toString() + 'px';
    };

    const setSizeToZero = () => {
        document.getElementById('reviews-div').style.height = '0px';
    };

    useEffect(() => {
        switch (size) {
            case 0:
                setSizeToZero();
                break;
            case 1:
                setSizeToFirstReviewSize();
                break;
            case 2:
                setSizeToFirstThreeReviewsSize();
                break;
            default:
                break;
        }
    }, [readMore]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        switch (size) {
            case 0:
                setReadMore(false);
                break;
            case 1:
                setReadMore(false);
                break;
            default:
                break;
        }
    }, [size]);

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
                            {months[parseInt(createdAt.split('-')[1]) - 1] +
                                ' ' +
                                parseInt(createdAt.split('-')[2]) +
                                ', ' +
                                parseInt(createdAt.split('-')[0])}
                        </h6>
                    )}
                </div>
            )}

            {content && (
                <pre
                    className='content'
                    dangerouslySetInnerHTML={{
                        __html:
                            !readMore && Marked(content).length > 500
                                ? Marked(content).slice(0, 500) + '...'
                                : Marked(content),
                    }}
                ></pre>
            )}
            {Marked(content).length > 500 && (
                <button
                    id='readbtn'
                    className='readbtn'
                    onClick={() => {
                        setReadMore(!readMore);
                    }}
                >
                    {readMore ? 'Read less' : 'Read more'}
                </button>
            )}
        </div>
    );
};

export default ReviewItem;
