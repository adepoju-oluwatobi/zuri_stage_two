import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import PlayIcon from "../assets/play-icon.svg";
import axios from "axios";
import Loading from "./Loading";
import Tmdb from "../assets/tmdb.svg";
import Berry from "../assets/berry.svg";

const Banner = () => {
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const TMDB_API_KEY = "bf0816c71498a511ab8ef58b56688fba";

  // Function to truncate text to a specified length and add an ellipsis
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  useEffect(() => {
    // Function to fetch random movie data from TMDB API
    const fetchRandomMovieData = async () => {
      try {
        // Generate a random page number between 1 and 1000 (adjust as needed)
        const randomPage = Math.floor(Math.random() * 1000) + 1;

        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${randomPage}`
        );

        if (
          response.data &&
          response.data.results &&
          response.data.results.length > 0
        ) {
          // Get a random movie from the results
          const randomIndex = Math.floor(
            Math.random() * response.data.results.length
          );
          setMovie(response.data.results[randomIndex]);

          // Fetch the movie rating
          const ratingResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${response.data.results[randomIndex].id}?api_key=${TMDB_API_KEY}&language=en-US`
          );

          if (ratingResponse.data && ratingResponse.data.vote_average) {
            // Format rating with one decimal place
            const formattedRating = (
              ratingResponse.data.vote_average * 10
            ).toFixed(1);
            setRating(formattedRating);
          } else {
            console.error("No rating data found.");
          }
        } else {
          console.error("No movie data found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRandomMovieData();
  }, []);

  // Function to handle adding to favorites
  const addToFavorites = () => {
    setFavoriteCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      {movie && (
        <div
          className="bg-cover bg-no-repeat bg-center h-[] md:h-[75vh] relative"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          <div className="bg-gradient-to-r from-black via-transparent to-black h-full w-full p-8 relative z-10">
            <Header />
            <div className="mt-[15%] md:mt-[10%]">
              <Link to={`/movies/${movie.id}`}>
                <div className="text-lg w-[20ch] md:text-4xl md:w-[15ch] min-h-fit mt-[10%] md:mt-[-3%] font-semibold text-white hover:text-slate-400 transition-all duration-300">
                  {movie.title}
                </div>
              </Link>
            </div>
            <div className="flex gap-5 my-4 text-white text-xs">
              <div className="flex gap-1 items-center">
                <img src={Tmdb} alt="" />
                <p>
                  {rating !== null ? `${rating}/100` : "Rating not available"}
                </p>
              </div>
              <div className="flex gap-1 items-center" onClick={addToFavorites}>
                <img src={Berry} alt="" />
                <p>{`${favoriteCount}%`}</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-white mt-2 w-[30ch]">
              {truncateText(movie.overview, 150)}{" "}
            </p>
            <Link to={`/movies/${movie.id}`}>
              <button className="p-2 text-sm text-white font-bold mt-4 bg-[#BE123C] hover:bg-[#830524] transition-all duration-300 rounded-lg flex gap-2 items-center">
                <img className="w-5 fill-white" src={PlayIcon} alt="" />
                WATCH TRAILER
              </button>
            </Link>
          </div>
        </div>
      )}
      {!movie && <Loading />}
    </div>
  );
};

export default Banner;
