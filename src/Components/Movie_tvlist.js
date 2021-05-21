import React from 'react';
import MovieTvItem from './Movie_Tv_Item';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../App';
import Loading from './Loading';

const MovieTvList = () => {
  const { dispatch, state } = useContext(GlobalContext);

  const movieTvComponent = (movieTv, mediaType) => {
    return movieTv.map((result) => {
      const { id, title, name, vote_average, poster_path, overview } = result;
      const poster = 'https://image.tmdb.org/t/p/w500/' + poster_path;
      return (
        <MovieTvItem
          key={id}
          id={id}
          title={title || name}
          rating={vote_average}
          poster={poster}
          overview={overview}
          mediaType={mediaType}
        />
      );
    });
  };

  useEffect(() => {
    let promise1 = fetch(
      'https://api.themoviedb.org/3/movie/popular?api_key=' +
        process.env.REACT_APP_MOVIEDB_KEY +
        '&language=en-US&page=1'
    );
    let promise2 = fetch(
      'https://api.themoviedb.org/3/tv/popular?api_key=' +
        process.env.REACT_APP_MOVIEDB_KEY +
        '&language=en-US&page=1'
    );

    Promise.all([promise1, promise2]).then((files) => {
      files[0]
        .json()
        .then((data) =>
          dispatch({ type: 'SET_MOVIES', payload: data.results })
        );
      files[1]
        .json()
        .then((data) => dispatch({ type: 'SET_TV', payload: data.results }));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ width: '99vw' }}>
      {state.movies && state.tv ? (
        <>
          <h1 className='headlines'>Popular movies right now</h1>
          <div className='lists'>{movieTvComponent(state.movies, 'movie')}</div>
          <h1 className='headlines'>Popular tv shows right now</h1>
          <div className='lists'>{movieTvComponent(state.tv, 'tv')}</div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MovieTvList;
