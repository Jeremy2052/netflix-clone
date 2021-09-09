import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

//base url to grab images of movies
const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchURL, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  //Need a snippet of code which runs based on a sepcific condition/variable
  //when Row renders make a request using useEffect, run snippet of code in the function each time
  useEffect(() => {
    //if [] blank, run once when the row loads, and dont run again
    // if pass something, load everytime that variable changes

    //async an internal function
    async function fetchData() {
      //when make a request, wait for it tto come back then do something
      const request = await axios.get(fetchURL);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchURL]); //<--- whenever you use a variable being pulled outside of block in useEffect, must include it in []

  //Youtube player APIz`
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    //if a trailer is already open and playing close it
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      //npm module
      movieTrailer(movie?.name || "")
        .then((url) => {
          //grab the end part of the trailer url
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      {/* Title */}
      <h2>{title}</h2>

      <div className="row__posters">
        {/* posters */}
        {movies.map((movie) => (
          <img
            key={movie.id}
            //onClick for when clicking on movie poster to play youtube trailer
            onClick={() => handleClick(movie)}
            //if has isLargeRow property use different clasName
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
