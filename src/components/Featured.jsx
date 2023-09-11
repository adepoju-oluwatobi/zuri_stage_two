import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from './Loading';

const Featured = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const TMDB_API_KEY = 'bf0816c71498a511ab8ef58b56688fba';

  useEffect(() => {
    // Function to fetch a list of featured movies from TMDB API
    const fetchFeaturedMovies = async () => {
      try {
        // You can customize the API request as needed
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );

        if (response.data && response.data.results && response.data.results.length > 0) {
          // Get the top 10 popular movies
          const featuredMovies = response.data.results.slice(0, 10);
          setMovies(featuredMovies);

          // Fetch and map movie genres
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
            console.error('No genre data found.');
          }
        } else {
          console.error('No featured movie data found.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchFeaturedMovies();
  }, []);

  // Function to fetch movie details by ID
  const fetchMovieDetailsById = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      );

      if (response.data) {
        // Process movie details here
        console.log('Movie Details:', response.data);
      } else {
        console.error(`No details found for movie with ID ${movieId}.`);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <div className='p-4 md:p-[70px] w-[100%] m-auto'>
      <p className='font-bold text-4xl mb-[50px]'>Featured Movies</p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-4 m-auto">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="relative">
              <div className='w-[150px] md:w-[250px]'>
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  alt={movie.title}
                  className="w-[150px] md:w-fit shadow-md"
                />
                <div className='flex mt-2'>
                  <p className="text-xs">
                    USA, 
                    {movie.production_countries &&
                      movie.production_countries.length > 0 &&
                      movie.production_countries[0].name}
                  </p>
                  <p className="text-xs">
                    {movie.release_date && movie.release_date.slice(0, 4)}
                  </p>
                </div>
                <h2 className="text-sm md:text-xl md:mt-2 font-semibold">
                  {movie.title}
                </h2>
                {/* Display movie genres using the genres state */}
                <p className="text-xs mt-1">
                  {movie.genre_ids.map((genreId) => genres[genreId]).join(', ')}
                </p>
                <button onClick={() => fetchMovieDetailsById(movie.id)}>
                  Fetch Movie Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
      {/* Increase the top margin of the row below the grid */}
      <div className="mt-8">
        {/* Content for the row below the grid */}
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default Featured;
