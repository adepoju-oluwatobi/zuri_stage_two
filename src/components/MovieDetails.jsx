import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import Header from './Header';

const MovieDetails = () => {
  const { id } = useParams(); // Extract the "id" parameter from the route
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const TMDB_API_KEY = 'bf0816c71498a511ab8ef58b56688fba';

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (response.data) {
          setMovieDetails(response.data);
        } else {
          console.error('No movie details found.');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]); // Use "id" as a dependency

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : movieDetails ? (
        <div className="movie-details">
            <div className=' bg-black pt-8 px-4 pb-4'>
            <Header />

            </div>
          <img
            src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`}
            alt={movieDetails.title}
          />
          <h2 data-testid="movie-title">{movieDetails.title}</h2>
          <h6 data-testid="movie-overview">{movieDetails.overview}</h6>
          <h6 data-testid="movie-runtime" className='font-bold'>{`${movieDetails.runtime} Minuites`}</h6>
          <p data-testid="movie-release-date">Release Year: {movieDetails.release_date && movieDetails.release_date.slice(0, 4)}</p>
          <p>Genre: {movieDetails.genres.map((genre) => genre.name).join(', ')}</p>
        </div>
      ) : (
        <p>No movie details found.</p>
      )}
    </div>
  );
};

export default MovieDetails;
