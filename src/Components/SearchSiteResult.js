import React from 'react';
import { Link } from 'react-router-dom';

const SearchSiteResult = ({ results, selectedResults }) => {
  return results.map((result) => {
    const {
      id,
      title,
      name,
      poster_path,
      profile_path,
      release_date,
      first_air_date,
      known_for_department,
      known_for,
      overview,
    } = result;
    let image =
      'https://image.tmdb.org/t/p/w500/' + (poster_path || profile_path);
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
      <div key={id} className='big-result'>
        <Link
          style={{ textDecoration: 'none' }}
          to={
            '/' +
            (selectedResults === 'Movies'
              ? 'movie/'
              : selectedResults === 'People'
              ? 'person/'
              : 'tv/') +
            id
          }
        >
          <div className='result-img-div'>
            <img
              className='result-img'
              src={image}
              onError={(e) =>
                (e.target.src =
                  selectedResults === 'Movies' || selectedResults === 'Tv shows'
                    ? 'https://i.imgur.com/XCOGZWQ.png'
                    : 'https://i.imgur.com/sdkYiCr.png')
              }
              alt=''
            ></img>
          </div>
        </Link>
        <div className='result-info'>
          <Link
            style={{ textDecoration: 'none' }}
            to={
              '/' +
              (selectedResults === 'Movies'
                ? 'movie/'
                : selectedResults === 'People'
                ? 'person/'
                : 'tv/') +
              id
            }
          >
            <h2 className='result-title'>{title || name}</h2>
          </Link>
          {release_date || first_air_date ? (
            <h3>
              {release_date
                ? months[parseInt(release_date.split('-')[1]) - 1] +
                  ' ' +
                  release_date.split('-')[2] +
                  ', ' +
                  release_date.split('-')[0]
                : months[parseInt(first_air_date.split('-')[1]) - 1] +
                  ' ' +
                  first_air_date.split('-')[2] +
                  ',   ' +
                  first_air_date.split('-')[0]}
            </h3>
          ) : (
            <h3>
              {known_for_department && known_for_department}
              {known_for && ' • '}
              {known_for &&
                known_for.map((role, i) => {
                  const { media_type, id, name, title } = role;
                  return (
                    <Link
                      key={id}
                      className='movie-tv-link'
                      to={'/' + media_type + '/' + id}
                    >
                      {i > 0 && ', '}
                      {title || name}
                    </Link>
                  );
                })}
            </h3>
          )}
          {overview && (
            <pre>
              {overview.length > 250
                ? overview.slice(0, 250) + '...'
                : overview}
            </pre>
          )}
        </div>
      </div>
    );
  });
};

export default SearchSiteResult;
