import React from "react";
import { useState, useEffect } from "react";

import "./SearchSite.css";

const SearchSite = () => {
  const [results, setResults] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("query");
  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/search/multi?api_key=" +
        "792dde4161d1a8ae31ac0fa85780d7fc" +
        "&language=en-US&query=" +
        search +
        "&page=1&include_adult=false"
    )
      .then((response) => response.json())
      .then((data) => setResults(data.results));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="search-site">
      <div className="results-selection box">
        <h2>Search results</h2>
        <div className="results-option">
          <h3>Movies</h3>
        </div>
        <div className="results-option">
          <h3 className="results-option">Tv shows</h3>
        </div>
        <div className="results-option">
          <h3 className="results-option">People</h3>
        </div>
      </div>
      <div className="search-results box"> results</div>
    </div>
  );
};

export default SearchSite;
