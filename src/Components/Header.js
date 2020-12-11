import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [options, setOptions] = useState([]);
  const [displayOptions, setDisplayOptions] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState(-1);

  const wrapperRef = useRef(null);

  const history = useHistory();

  const handleSearchBtnClick = () => {
    search.length > 0 && history.push("../search?query=" + search);
  };

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setSelectedOption(-1);
      setDisplayOptions(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSelectedOption(-1);
  };

  const handleSearchBarClick = () => {
    if (displayOptions === false) setDisplayOptions(true);
  };

  const handleResultOnMouseOver = (option) => {
    setSelectedOption(option);
  };

  const handleSearchonKeyDown = (e) => {
    if (e.keyCode === 38) {
      e.preventDefault();
      if (selectedOption === 0) return;
      setSelectedOption(selectedOption - 1);
    }
    if (e.keyCode === 40) {
      e.preventDefault();
      if (selectedOption + 1 === options.length) return;
      setSelectedOption(selectedOption + 1);
    }
    if (e.keyCode === 13) {
      if (selectedOption === 0) {
        setSelectedOption(-1);
        setDisplayOptions(false);
        const { media_type, id } = options[selectedOption];
        history.push("/" + media_type + "/" + id);
      } else {
        search.length > 0 && history.push("../search?query=" + search);
      }
    }
  };

  const handleLinkClick = () => {
    setSelectedOption(0);
    setDisplayOptions(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      fetch(
        "https://api.themoviedb.org/3/search/multi?api_key=" +
          "792dde4161d1a8ae31ac0fa85780d7fc" +
          "&language=en-US&query=" +
          search +
          "&page=1&include_adult=false"
      )
        .then((response) => response.json())
        .then((data) => setOptions(data.results.slice(0, 10)));
    } else setOptions([]);
  }, [search]);

  useEffect(() => {
    if (options.length > 0) setDisplayOptions(true);
  }, [options]);

  return (
    <div className="headerdiv">
      <div className="header">
        <Link to="/" className="logo">
          <img
            src="https://cdn4.iconfinder.com/data/icons/planner-color/64/popcorn-movie-time-512.png"
            alt="popcorn"
          />
          <h1>Moviezz</h1>
        </Link>
        <div className="searchdiv" ref={wrapperRef}>
          <div className="searchbar">
            <input
              className="search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearchChange(e)}
              onClick={() => handleSearchBarClick()}
              onKeyDown={(e) => handleSearchonKeyDown(e)}
            />
            <button
              className="searchbtn"
              onClick={() => handleSearchBtnClick()}
            >
              <i className="icon fas fa-search fa-lg"></i>
            </button>
          </div>
          {displayOptions > 0 && (
            <div className="autocontainer">
              {options.map((result, i) => {
                const {
                  id,
                  name,
                  title,
                  media_type,
                  profile_path,
                  poster_path,
                } = result;

                let image =
                  media_type === "person"
                    ? "https://image.tmdb.org/t/p/w500/" + profile_path
                    : "https://image.tmdb.org/t/p/w500/" + poster_path;
                return (
                  <Link
                    to={"/" + media_type + "/" + id}
                    className={
                      selectedOption === i ? "result selected" : "result"
                    }
                    onMouseOver={() => handleResultOnMouseOver(i)}
                    key={i}
                    onClick={() => handleLinkClick()}
                  >
                    <img id="img" src={image} alt="" />
                    <h2>{title || name}</h2>
                    <p>
                      {media_type.charAt(0).toUpperCase() + media_type.slice(1)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
