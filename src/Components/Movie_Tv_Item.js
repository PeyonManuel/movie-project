import React from "react";
import "./Movie_Tv_Item.css";
import { Link } from "react-router-dom";
const MovieTvItem = React.memo(
  ({ id, title, rating, poster, overview, mediaType }) => {
    return (
      <div className="movietv">
        <Link to={"/" + mediaType + "/" + id} className="link img">
          <div className="imgdiv">
            <img
              src={poster}
              alt={title + " poster"}
              onError={(e) =>
                (e.target.src = "https://i.imgur.com/sdkYiCr.png")
              }
            />
          </div>
        </Link>
        <Link to={"/" + mediaType + "/" + id} className="link title">
          <h2>{title}</h2>
        </Link>
        <h3
          className={
            "rating " +
            (rating
              ? rating > 7.5
                ? "green"
                : rating > 5
                ? "yellow"
                : "red"
              : "white")
          }
        >
          {rating ? rating : "NYR"}
        </h3>
        <Link to={"/" + mediaType + "/" + id} className="link title">
          <div className="overview">
            <h4>Overview:</h4>
            {overview ? overview : "-"}
          </div>
        </Link>
      </div>
    );
  }
);

export default MovieTvItem;
