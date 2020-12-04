import React from 'react';
import { useState, useEffect, useReducer, createContext } from 'react';
import { useParams } from 'react-router-dom';
import PersonItem from '../PersonItem';
import ReviewItem from '../ReviewItem';
import SimilarMovies from './SimilarMovies';
import InfoCard from './InfoCard';
import MovieReducer from './MovieReducer';

import './Movie.css';

export const MovieContext = createContext();

const Movie = () => {
    const defaultState = {
        movieCredits: [],
    };

    const [state, dispatch] = useReducer(MovieReducer, defaultState);
    const [reviews, setReviews] = useState({});
    const [reviewSize, setReviewSize] = useState(0);

    const { id } = useParams();

    useEffect(() => {
        fetch(
            'https://api.themoviedb.org/3/movie/' +
                id +
                '/reviews' +
                '?api_key=' +
                '792dde4161d1a8ae31ac0fa85780d7fc' +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setReviews(data));
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const { movieCredits } = state;
    return (
        <MovieContext.Provider value={{ dispatch: dispatch, state: state }}>
            <div className='moviecard'>
                <InfoCard id={id} />

                {movieCredits.cast && (
                    <div className='cast-div'>
                        <h2 className='cast-header'>Cast</h2>
                        <div className='cast'>
                            {movieCredits.cast.map((person) => {
                                const {
                                    id,
                                    name,
                                    profile_path,
                                    character,
                                } = person;
                                const profile =
                                    'https://image.tmdb.org/t/p/w500/' +
                                    profile_path;
                                return (
                                    <PersonItem
                                        key={id}
                                        id={id}
                                        name={name}
                                        profile={profile}
                                        character={character}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                {reviews && reviews.results && reviews.results.length > 0 && (
                    <>
                        <div className='reviews'>
                            <h2 className='reviews-header'>Reviews</h2>
                            <div id='reviews-div' className='reviews-div'>
                                {reviews &&
                                    reviews.results &&
                                    reviews.results.map((review, i) => {
                                        const {
                                            author,
                                            author_details,
                                            content,
                                            created_at,
                                            id,
                                        } = review;
                                        const {
                                            avatar_path,
                                            rating,
                                        } = author_details;
                                        return (
                                            <ReviewItem
                                                author={author}
                                                avatarPath={avatar_path}
                                                content={content}
                                                createdAt={created_at}
                                                rating={rating}
                                                id={id}
                                                key={id}
                                                index={i}
                                            />
                                        );
                                    })}
                            </div>

                            <button
                                className='more-reviewsbtn-up reviewsbtn'
                                onClick={() => {
                                    const firstReviewSize =
                                        document
                                            .querySelectorAll('.reviews-div')[0]
                                            .childNodes[0].clientHeight.toString() +
                                        'px';
                                    const childNodes = document.querySelectorAll(
                                        '.reviews-div'
                                    )[0].childNodes;
                                    let acumulator = 0;
                                    for (let i = 0; i < 3; i++) {
                                        acumulator += childNodes[i]
                                            ? childNodes[i].clientHeight
                                            : 0;
                                    }
                                    const firstThreeReviewsSize =
                                        acumulator.toString() + 'px';

                                    switch (
                                        document.getElementById('reviews-div')
                                            .style.height
                                    ) {
                                        case firstThreeReviewsSize:
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height = firstReviewSize;
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.overflow = 'visible';
                                            break;
                                        case firstReviewSize:
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height = '0';
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.overflow = 'visible';
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            >
                                <i className='fas fa-caret-up fa-1x'></i>
                            </button>
                            <button
                                className='more-reviewsbtn-down reviewsbtn'
                                onClick={() => {
                                    const firstReviewSize =
                                        document
                                            .querySelectorAll('.reviews-div')[0]
                                            .childNodes[0].clientHeight.toString() +
                                        'px';
                                    const childNodes = document.querySelectorAll(
                                        '.reviews-div'
                                    )[0].childNodes;
                                    let acumulator = 0;
                                    for (let i = 0; i < 3; i++) {
                                        acumulator += childNodes[i]
                                            ? childNodes[i].clientHeight
                                            : 0;
                                    }
                                    const firstThreeReviewsSize =
                                        acumulator.toString() + 'px';
                                    console.log(firstReviewSize);
                                    if (
                                        !document.getElementById('reviews-div')
                                            .style.height ||
                                        document.getElementById('reviews-div')
                                            .style.height === '0px'
                                    ) {
                                        document.getElementById(
                                            'reviews-div'
                                        ).style.height = firstReviewSize;
                                    } else {
                                        document.getElementById(
                                            'reviews-div'
                                        ).style.height = firstThreeReviewsSize;
                                        document.getElementById(
                                            'reviews-div'
                                        ).style.overflow = 'auto';
                                    }
                                }}
                            >
                                <i className='fas fa-caret-down fa-1x'></i>
                            </button>
                        </div>
                    </>
                )}
                <SimilarMovies id={id} />
            </div>
        </MovieContext.Provider>
    );
};

export default Movie;
