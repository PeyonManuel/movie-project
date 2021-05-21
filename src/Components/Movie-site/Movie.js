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
import MovieReducer from './MovieReducer';
import MovieInfoCard from './MovieInfoCard';
import Loading from '../Loading';
import './Movie.css';

const PersonItem = lazy(() => import('../PersonItem'));
const MovieReviewItem = lazy(() => import('./MovieReviewItem'));
const MovieDetails = lazy(() => import('./MovieDetails'));
const SimilarMovies = lazy(() => import('./SimilarMovies'));

export const MovieContext = createContext();

const Movie = () => {
  const defaultState = {
    movie: '',
    movieCredits: [],
  };

  const [state, dispatch] = useReducer(MovieReducer, defaultState);
  const [reviews, setReviews] = useState({});
  const [reviewSize, setReviewSize] = useState(0);
  const [displayAllCast, setDisplayAllCast] = useState(false);

  const { id } = useParams();

  const castComponent = (cast) => {
    return cast.map((person) => {
      const { id, name, profile_path, character } = person;
      const profile = 'https://image.tmdb.org/t/p/w500/' + profile_path;
      return (
        <PersonItem
          key={id}
          id={id}
          name={name}
          profile={profile}
          character={character}
        />
      );
    });
  };

  useEffect(() => {
    setDisplayAllCast(false);
    setReviewSize(0);
    fetch(
      'https://api.themoviedb.org/3/movie/' +
        id +
        '/credits' +
        '?api_key=' +
        process.env.REACT_APP_MOVIEDB_KEY +
        '&language=en-US'
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: 'SET_MOVIE_CREDITS', payload: data });
      });
    fetch(
      'https://api.themoviedb.org/3/movie/' +
        id +
        '/reviews' +
        '?api_key=' +
        process.env.REACT_APP_MOVIEDB_KEY +
        '&language=en-US'
    )
      .then((response) => response.json())
      .then((data) => setReviews(data));
    fetch(
      'https://api.themoviedb.org/3/movie/' +
        id +
        '?api_key=' +
        process.env.REACT_APP_MOVIEDB_KEY +
        '&language=en-US'
    )
      .then((response) => response.json())
      .then((data) => {
        data.status_code !== 34
          ? dispatch({ type: 'SET_MOVIE', payload: data })
          : window.location.replace('../error');
      });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const { movieCredits, movie } = state;
  return (
    <>
      {movie ? (
        <MovieContext.Provider value={{ dispatch: dispatch, state: state }}>
          <div className='moviecard'>
            <MovieInfoCard id={id} />

            {movieCredits.cast && movieCredits.cast.length > 0 && (
              <div className='cast-div'>
                <h2 className='cast-header'>Cast</h2>
                <Suspense fallback={<h3>Loading...</h3>}>
                  <div className='cast'>
                    {movieCredits.cast.length > 30 ? (
                      <>
                        {castComponent(movieCredits.cast.slice(0, 30))}{' '}
                        {!displayAllCast ? (
                          <button
                            className='load-all-castbtn'
                            onClick={() => setDisplayAllCast(true)}
                          >
                            Load all
                          </button>
                        ) : (
                          castComponent(movieCredits.cast.slice(30))
                        )}{' '}
                      </>
                    ) : (
                      castComponent(movieCredits.cast)
                    )}
                  </div>
                </Suspense>
              </div>
            )}
            <Suspense fallback={<></>}>
              <MovieDetails />
            </Suspense>

            {reviews && reviews.results && reviews.results.length > 0 && (
              <>
                <div className='reviews'>
                  <h2 className='reviews-header'>Reviews</h2>
                  <Suspense fallback={<h3>Loading...</h3>}>
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
                          const { avatar_path, rating } = author_details;
                          return (
                            <MovieReviewItem
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
                          .childNodes[0].clientHeight.toString() + 'px';
                      const childNodes =
                        document.querySelectorAll('.reviews-div')[0].childNodes;
                      let acumulator = 0;
                      for (let i = 0; i < 3; i++) {
                        acumulator += childNodes[i]
                          ? childNodes[i].clientHeight
                          : 0;
                      }
                      const firstThreeReviewsSize =
                        acumulator.toString() + 'px';

                      switch (
                        document.getElementById('reviews-div').style.height
                      ) {
                        case firstReviewSize:
                          document.getElementById('reviews-div').style.height =
                            '0';
                          document.getElementById(
                            'reviews-div'
                          ).style.overflow = 'visible';
                          setReviewSize(0);
                          break;
                        case firstThreeReviewsSize:
                          document.getElementById('reviews-div').style.height =
                            firstReviewSize;
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
                          .childNodes[0].clientHeight.toString() + 'px';
                      const childNodes =
                        document.querySelectorAll('.reviews-div')[0].childNodes;
                      let acumulator = 0;
                      for (let i = 0; i < 3; i++) {
                        acumulator += childNodes[i]
                          ? childNodes[i].clientHeight
                          : 0;
                      }
                      const firstThreeReviewsSize =
                        acumulator.toString() + 'px';
                      if (
                        !document.getElementById('reviews-div').style.height ||
                        document.getElementById('reviews-div').style.height ===
                          '0px'
                      ) {
                        document.getElementById('reviews-div').style.height =
                          firstReviewSize;
                        setReviewSize(1);
                      } else {
                        document.getElementById('reviews-div').style.height =
                          firstThreeReviewsSize;
                        document.getElementById('reviews-div').style.overflow =
                          'auto';
                        setReviewSize(2);
                      }
                    }}
                  >
                    <i className='fas fa-caret-down fa-1x'></i>
                  </button>
                </div>
              </>
            )}
            <Suspense fallback={<></>}>
              <SimilarMovies id={id} />
            </Suspense>
          </div>
        </MovieContext.Provider>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Movie;
