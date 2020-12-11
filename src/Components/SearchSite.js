import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./SearchSite.css";

const SearchSite = () => {
  const [movieResults, setMovieResults] = useState("");
  const [tvResults, setTvResults] = useState("");
  const [peopleResults, setPeopleResults] = useState("");
  const [selectedResults, setSelectedResults] = useState("");
  const [page, setPage] = useState(1);

  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("query");

  const renderResults = (results) => {
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
        "https://image.tmdb.org/t/p/w500/" + (poster_path || profile_path);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return (
        <div key={id} className="big-result">
          <Link
            style={{ textDecoration: "none" }}
            to={
              "/" +
              (selectedResults === "Movies"
                ? "movie/"
                : selectedResults === "People"
                ? "person/"
                : "tv/") +
              id
            }
          >
            <img
              className="result-img"
              src={image}
              onError={(e) =>
                (e.target.src =
                  selectedResults === "Movies" || selectedResults === "Tv shows"
                    ? "https://i.imgur.com/CfKSsjz.png"
                    : "https://i.imgur.com/sdkYiCr.png")
              }
              alt=""
            ></img>
          </Link>
          <div className="result-info">
            <Link
              style={{ textDecoration: "none" }}
              to={
                "/" +
                (selectedResults === "Movies"
                  ? "movie/"
                  : selectedResults === "People"
                  ? "person/"
                  : "tv/") +
                id
              }
            >
              <h2 className="result-title">{title || name}</h2>
            </Link>
            {release_date || first_air_date ? (
              <h3>
                {release_date
                  ? months[parseInt(release_date.split("-")[1]) - 1] +
                    " " +
                    release_date.split("-")[2] +
                    ", " +
                    release_date.split("-")[0]
                  : months[parseInt(first_air_date.split("-")[1]) - 1] +
                    " " +
                    first_air_date.split("-")[2] +
                    ",   " +
                    first_air_date.split("-")[0]}
              </h3>
            ) : (
              <h3>
                {known_for_department && known_for_department}
                {known_for && " • "}
                {known_for &&
                  known_for.map((role, i) => {
                    const { media_type, id, name, title } = role;
                    return (
                      <Link
                        key={id}
                        className="movie-tv-link"
                        to={"/" + media_type + "/" + id}
                      >
                        {i > 0 && ", "}
                        {title || name}
                      </Link>
                    );
                  })}
              </h3>
            )}
            {overview && (
              <pre>
                {overview.length > 250
                  ? overview.slice(0, 250) + "..."
                  : overview}
              </pre>
            )}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    setPage(1);
    fetch(
      "https://api.themoviedb.org/3/search/person?api_key=" +
        "792dde4161d1a8ae31ac0fa85780d7fc" +
        "&language=en-US&query=" +
        search +
        "&page=" +
        page +
        "&include_adult=false"
    )
      .then((response) => response.json())
      .then((data) => setPeopleResults(data));

    fetch(
      "https://api.themoviedb.org/3/search/movie?api_key=" +
        "792dde4161d1a8ae31ac0fa85780d7fc" +
        "&language=en-US&query=" +
        search +
        "&page=" +
        page +
        "&include_adult=false"
    )
      .then((response) => response.json())
      .then((data) => setMovieResults(data));

    fetch(
      "https://api.themoviedb.org/3/search/tv?api_key=" +
        "792dde4161d1a8ae31ac0fa85780d7fc" +
        "&language=en-US&query=" +
        search +
        "&page=" +
        page +
        "&include_adult=false"
    )
      .then((response) => response.json())
      .then((data) => setTvResults(data));
  }, [selectedResults]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (movieResults && tvResults && peopleResults) {
      let resultsPopularity = [
        ["Movies", 0],
        ["Tv shows", 0],
        ["People", 0],
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
        if (i === 0 && selectedResults === "")
          setSelectedResults(resultsPopularity[i][0].split(" ")[0]);
        document.getElementById("o" + (i + 1)).innerHTML =
          "<h3>" +
          resultsPopularity[i][0] +
          "</h3> <h4>" +
          totalResults[resultsPopularity[i][0].split(" ").join("")] +
          "</h4>";
      }
    }
  }, [tvResults, movieResults, peopleResults]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="search-site">
      <div className="results-selection box">
        <h2>Search results</h2>
        <div
          id="o1"
          className="results-option"
          onClick={(e) =>
            setSelectedResults(
              document.querySelector("#o1").children[0].innerText
            )
          }
        ></div>
        <div
          id="o2"
          className="results-option"
          onClick={(e) =>
            setSelectedResults(
              document.querySelector("#o2").children[0].innerText
            )
          }
        ></div>
        <div
          id="o3"
          className="results-option"
          onClick={(e) =>
            setSelectedResults(
              document.querySelector("#o3").children[0].innerText
            )
          }
        ></div>
      </div>
      <div className="search-results box">
        {selectedResults &&
          (selectedResults === "Movies" ? (
            movieResults.results.length > 0 ? (
              renderResults(movieResults.results)
            ) : (
              <h3>We found no results for this category</h3>
            )
          ) : selectedResults === "Tv shows" ? (
            tvResults.results.length > 0 ? (
              renderResults(tvResults.results)
            ) : (
              <h3>We found no results for this category</h3>
            )
          ) : peopleResults.results.length > 0 ? (
            renderResults(peopleResults.results)
          ) : (
            <h3>We found no results for this category</h3>
          ))}
      </div>
    </div>
  );
};

export default SearchSite;
