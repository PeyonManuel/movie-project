import React from 'react';
import {
    useState,
    useEffect,
    useReducer,
    createContext,
    lazy,
    Suspense,
} from 'react';
import { useParams } from 'react-router-dom';
import TvReducer from './TvReducer';
import TvInfoCard from './TvInfoCard';
import Loading from '../Loading'
import './Tv.css';

const PersonItem = lazy(() => import('../PersonItem'));
const TvReviewItem = lazy(() => import('./TvReviewItem'));
const TvDetails = lazy(() => import('./TvDetails'));
const SimilarTvShows = lazy(() => import('./SimilarTvShows'));

export const TvContext = createContext();

const Tv = () => {
    const defaultState = {
        tv: '',
        tvCredits: [],
    };

    const [state, dispatch] = useReducer(TvReducer, defaultState);
    const [reviews, setReviews] = useState({});
    const [reviewSize, setReviewSize] = useState(0);
    const [displayAllCast, setDisplayAllCast] = useState(false);

    const { id } = useParams();

    const castComponent = (cast) => {
        return cast.map((person) => {
            const { id, name, profile_path, roles } = person;
            const profile = 'https://image.tmdb.org/t/p/w500/' + profile_path;
            return (
                <PersonItem
                    key={id}
                    id={id}
                    name={name}
                    profile={profile}
                    character={roles.map((role) => role.character !== '' ? role.character : 'Unknown' ).join(', ')}
                    episodeCount={roles
                        .map((role) => role.episode_count)
                        .join(', ')}
                />
            );
        });
    };

    useEffect(() => {
        setDisplayAllCast(false);
        setReviewSize(0);
        fetch(
            'https://api.themoviedb.org/3/tv/' +
                id +
                '/aggregate_credits' +
                '?api_key=' +
                process.env.REACT_APP_MOVIEDB_KEY +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => {
                dispatch({ type: 'SET_TV_CREDITS', payload: data });
            });
        fetch(
            'https://api.themoviedb.org/3/tv/' +
                id +
                '/reviews' +
                '?api_key=' +
                process.env.REACT_APP_MOVIEDB_KEY +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => setReviews(data));
        fetch(
            'https://api.themoviedb.org/3/tv/' +
                id +
                '?api_key=' +
                process.env.REACT_APP_MOVIEDB_KEY +
                '&language=en-US'
        )
            .then((response) => response.json())
            .then((data) => {
                data.status_code !== 34 ?
                dispatch({ type: 'SET_TV', payload: data }) : window.location.replace("../error")});
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const { tvCredits, tv } = state;
    return (
        <>
        {tv ? <TvContext.Provider value={{ dispatch: dispatch, state: state }}>
            <div className='tvcard'>
                <TvInfoCard id={id} />
                {tvCredits.cast && (
                    <div className='cast-div'>
                        <h2 className='cast-header'>Cast</h2>
                        <Suspense fallback={<></>}>
                            <div className='cast'>
                                {tvCredits.cast.length > 30 ? (
                                    <>
                                        {castComponent(
                                            tvCredits.cast.slice(0, 30)
                                        )}{' '}
                                        {!displayAllCast ? (
                                            <button
                                                className='load-all-castbtn'
                                                onClick={() =>
                                                    setDisplayAllCast(true)
                                                }
                                            >
                                                Load all
                                            </button>
                                        ) : (
                                            castComponent(
                                                tvCredits.cast.slice(30)
                                            )
                                        )}{' '}
                                    </>
                                ) : (
                                    castComponent(tvCredits.cast)
                                )}
                            </div>
                        </Suspense>
                    </div>
                )}
                <Suspense fallback={<></>}>
                    <TvDetails />
                </Suspense>
                {reviews && reviews.results && reviews.results.length > 0 && (
                    <>
                        <div className='reviews'>
                            <h2 className='reviews-header'>Reviews</h2>
                            <Suspense fallback={<></>}>
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
                                                <TvReviewItem
                                                    author={author}
                                                    avatarPath={avatar_path}
                                                    content={content}
                                                    createdAt={created_at}
                                                    rating={rating}
                                                    id={id}
                                                    key={id}
                                                    index={i}
                                                    size={reviewSize}
                                                />
                                            );
                                        })}
                                </div>
                            </Suspense>
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
                                        case firstReviewSize:
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height = '0';
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.overflow = 'visible';
                                            setReviewSize(0);
                                            break;
                                        case firstThreeReviewsSize:
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.height = firstReviewSize;
                                            document.getElementById(
                                                'reviews-div'
                                            ).style.overflow = 'visible';
                                            setReviewSize(1);
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
                                    if (
                                        !document.getElementById('reviews-div')
                                            .style.height ||
                                        document.getElementById('reviews-div')
                                            .style.height === '0px'
                                    ) {
                                        document.getElementById(
                                            'reviews-div'
                                        ).style.height = firstReviewSize;
                                        setReviewSize(1);
                                    } else {
                                        document.getElementById(
                                            'reviews-div'
                                        ).style.height = firstThreeReviewsSize;
                                        document.getElementById(
                                            'reviews-div'
                                        ).style.overflow = 'auto';
                                        setReviewSize(2);
                                    }
                                }}
                            >
                                <i className='fas fa-caret-down fa-1x'></i>
                            </button>
                        </div>
                    </>
                )}{' '}
                <Suspense fallback={<></>}>
                    <SimilarTvShows id={id} />
                </Suspense>
            </div>
        </TvContext.Provider> : <Loading />}
        </>
    );
};

export default Tv;
