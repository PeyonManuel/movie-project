import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import SearchSiteResult from './SearchSiteResult';

const SearchSite = () => {
  const [movieResults, setMovieResults] = useState('');
  const [tvResults, setTvResults] = useState('');
  const [peopleResults, setPeopleResults] = useState('');
  const [selectedResults, setSelectedResults] = useState('');
  const [page, setPage] = useState(1);
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('query');

  const history = useHistory();

  const renderButtons = () => {
    const results =
      selectedResults === 'Movies'
        ? movieResults
        : selectedResults === 'Tv'
        ? tvResults
        : peopleResults;
    const buttons = [];
    const totalPages = results.total_pages;
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        if (
          (page <= 7 && i <= 7) ||
          (i <= page + 3 && i >= page - 3) ||
          i >= totalPages - 1 ||
          (page > totalPages - 7 && i > totalPages - 7) ||
          i <= 2
        ) {
          if (page !== i) {
            buttons.push(
              <>
                {i >= page + 6 && i !== totalPages && i !== 7 && (
                  <span>{' ... '}</span>
                )}
                <button
                  key={i}
                  className='pagebtn'
                  onClick={() => {
                    setPage(i);
                    window.scrollTo(0, 0);
                  }}
                >
                  {i}
                </button>
                {i <= page - 6 && i !== 1 && i !== totalPages - 6 && (
                  <span>{' ... '}</span>
                )}
              </>
            );
          } else {
            buttons.push(
              <span key={i} className='current-pagebtn'>
                {i}
              </span>
            );
          }
        }
      }
    }
    return buttons;
  };

  useEffect(() => {
    if (!search) history.push('/error');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedResults !== '') {
      document.querySelector('.results-selection').style.display = 'block';
      document.querySelector('.search-results').style.display = 'flex';
    }
    fetch(
      'https://api.themoviedb.org/3/search/person?api_key=' +
        '792dde4161d1a8ae31ac0fa85780d7fc' +
        '&language=en-US&query=' +
        search +
        '&page=' +
        page +
        '&include_adult=false'
    )
      .then((response) => response.json())
      .then((data) => setPeopleResults(data));

    fetch(
      'https://api.themoviedb.org/3/search/movie?api_key=' +
        '792dde4161d1a8ae31ac0fa85780d7fc' +
        '&language=en-US&query=' +
        search +
        '&page=' +
        page +
        '&include_adult=false'
    )
      .then((response) => response.json())
      .then((data) => setMovieResults(data));

    fetch(
      'https://api.themoviedb.org/3/search/tv?api_key=' +
        '792dde4161d1a8ae31ac0fa85780d7fc' +
        '&language=en-US&query=' +
        search +
        '&page=' +
        page +
        '&include_adult=false'
    )
      .then((response) => response.json())
      .then((data) => setTvResults(data));
  }, [selectedResults, page]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (movieResults && tvResults && peopleResults) {
      let resultsPopularity = [
        ['Movies', 0],
        ['Tv shows', 0],
        ['People', 0],
      ];

      const totalResults = {
        Movies: movieResults.total_results,
        Tvshows: tvResults.total_results,
        People: peopleResults.total_results,
      };

      for (let i = 0; i < movieResults.results.length; i++) {
        resultsPopularity[0][1] += movieResults.results[i].popularity;
      }

      for (let j = 0; j < tvResults.results.length; j++) {
        resultsPopularity[1][1] += tvResults.results[j].popularity;
      }

      for (let j = 0; j < peopleResults.results.length; j++) {
        resultsPopularity[2][1] += peopleResults.results[j].popularity;
      }

      resultsPopularity.sort((a, b) => b[1] - a[1]);

      for (let i = 0; i < resultsPopularity.length; i++) {
        if (i === 0 && selectedResults === '')
          setSelectedResults(resultsPopularity[i][0].split(' ')[0]);
        document.getElementById('o' + (i + 1)).innerHTML =
          '<h3 data-option=' +
          resultsPopularity[i][0] +
          '>' +
          resultsPopularity[i][0] +
          '</h3> <h4>' +
          totalResults[resultsPopularity[i][0].split(' ').join('')] +
          '</h4>';
      }
    }
  }, [tvResults, movieResults, peopleResults]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='search-site'>
      <div className='results-selection box'>
        <h2>Search results</h2>
        <div
          id='o1'
          className={'results-option' + (selectedResults === 'Movies' ? ' selected' : '')}
          onClick={(e) => {
            setSelectedResults(
              document.querySelector('#o1').children[0].dataset.option
            );
            setPage(1);
          }}
        ></div>
        <div
          id='o2'
          className={'results-option' + (selectedResults === 'Tv' ? ' selected' : '')}
          onClick={(e) => {
            setSelectedResults(
              document.querySelector('#o2').children[0].dataset.option
            );
            setPage(1);
          }}
        ></div>
        <div
          id='o3'
          className={'results-option' + (selectedResults === 'People' ? ' selected' : '')}
          onClick={(e) => {
            setSelectedResults(
              document.querySelector('#o3').children[0].dataset.option
            );
            setPage(1);
          }}
        ></div>
      </div>
      <div className='search-results box'>
        {selectedResults &&
          (selectedResults === 'Movies' ? (
            movieResults.results.length > 0 ? (
              <SearchSiteResult
                results={movieResults.results}
                selectedResults={selectedResults}
              />
            ) : (
              <h3>We found no results for this category</h3>
            )
          ) : selectedResults === 'Tv' ? (
            tvResults.results.length > 0 ? (
              <SearchSiteResult
                results={tvResults.results}
                selectedResults={selectedResults}
              />
            ) : (
              <h3>We found no results for this category</h3>
            )
          ) : peopleResults.results.length > 0 ? (
            <SearchSiteResult
              results={peopleResults.results}
              selectedResults={selectedResults}
            />
          ) : (
            <h3>We found no results for this category</h3>
          ))}
        <div className='pagebtns'>{renderButtons()}</div>
      </div>
    </div>
  );
};

export default SearchSite;
