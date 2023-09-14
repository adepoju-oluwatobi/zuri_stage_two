import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import FavIcon from "../assets/fav.svg";
import Tmdb from "../assets/tmdb.svg";
import Berry from "../assets/berry.svg";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";

const Featured = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [favorites, setFavorites] = useState({}); // State to store favorite counts
  const TMDB_API_KEY = "bf0816c71498a511ab8ef58b56688fba";
  const navigate = useNavigate();

  // Load favorites from local storage when the component mounts
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to local storage whenever the favorites state changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchFeaturedMovies = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const featuredMovies = response.data.results.slice(0, 10);

        const moviesWithRatings = await Promise.all(
          featuredMovies.map(async (movie) => {
            const ratingResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`
            );

            if (ratingResponse.data && ratingResponse.data.vote_average) {
              const ratingPercentage = (
                ratingResponse.data.vote_average * 10
              ).toFixed(1);

              return {
                ...movie,
                rating: ratingPercentage,
              };
            }

            return movie;
          })
        );

        setMovies(moviesWithRatings);

        const genresResponse = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (genresResponse.data && genresResponse.data.genres) {
          const genreMap = genresResponse.data.genres.reduce(
            (acc, genre) => ({
              ...acc,
              [genre.id]: genre.name,
            }),
            {}
          );

          setGenres(genreMap);
        } else {
          console.error("No genre data found.");
        }
      } else {
        console.error("No featured movie data found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedMovies();
  }, [fetchFeaturedMovies]);

  // Function to handle favoriting a movie
  const toggleFavorite = (movieId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      // Increment the favorite count
      [movieId]: (prevFavorites[movieId] || 0) + 1,
    }));
  };

  const calculateFavoritePercentage = (movieId) => {
    // Define your maximum favorite count
    const maxFavoriteCount = 100;
    const favoriteCount = favorites[movieId] || 0;
    // Calculate as a percentage with one decimal place
    return ((favoriteCount / maxFavoriteCount) * 100).toFixed(0);
  };

  const fetchMovieDetailsById = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="p-4 md:p-[70px] w-[100%] m-auto">
      <p className="font-bold text-4xl mb-[50px]">Featured Movies</p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-4 m-auto">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="relative">
              <div data-testid="movie-card" className="w-[150px] md:w-[250px]">
                <img
                  className="relative top-[65px] left-[75%] md:w-[40px] opacity-90 hover:opacity-100 cursor-pointer"
                  src={FavIcon}
                  alt=""
                />
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  alt={movie.title}
                  data-testid="movie-poster"
                  className="w-[150px] md:w-fit shadow-md"
                  onClick={() => fetchMovieDetailsById(movie.id)}
                />

                <div className="flex mt-2">
                  <p className="text-xs">
                    USA,
                    {movie.production_countries &&
                      movie.production_countries.length > 0 &&
                      movie.production_countries[0].name}
                  </p>
                  <p data-testid="movie-release-date" className="text-xs">
                    {movie.release_date && movie.release_date.slice(0, 4)}
                  </p>
                </div>
                <h2
                  data-testid="movie-title"
                  className="text-sm md:text-xl md:mt-2 mb-2 font-semibold"
                >
                  {movie.title}
                </h2>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={Tmdb} alt="" />
                    <p className="text-xs md:text-sm opacity-50">
                      {movie.rating}/100
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <img
                      src={Berry}
                      alt=""
                      onClick={() => toggleFavorite(movie.id)}
                    />
                    <p className="text-xs md:text-sm opacity-50">
                      {calculateFavoritePercentage(movie.id)}%
                    </p>{" "}
                  </div>
                </div>
                <p className="text-xs mt-1 opacity-50">
                  {movie.genre_ids.map((genreId) => genres[genreId]).join(", ")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
      <div className="mt-8"></div>
    </div>
  );
};

export default Featured;
