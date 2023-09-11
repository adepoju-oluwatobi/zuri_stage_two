import React, { useEffect, useState } from 'react';
import Header from './Header';
import PlayIcon from '../assets/play-icon.svg';
import axios from 'axios';
import Loading from './Loading';

const Banner = () => {
  const [movie, setMovie] = useState(null);
  const TMDB_API_KEY = 'bf0816c71498a511ab8ef58b56688fba';

  // Function to truncate text to a specified length and add an ellipsis
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
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

        if (response.data && response.data.results && response.data.results.length > 0) {
          // Get a random movie from the results
          const randomIndex = Math.floor(Math.random() * response.data.results.length);
          setMovie(response.data.results[randomIndex]);
        } else {
          console.error('No movie data found.');
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchRandomMovieData();
  }, []);

  return (
    <div>
      {movie && (
        <div
          className="bg-cover bg-no-repeat bg-center h-[60vh] md:h-[90vh] relative"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          <div className="bg-gradient-to-r from-black via-transparent to-black h-full w-full p-8 relative z-10">
            <Header />
            <h1 className="text-lg w-[20ch] md:text-4xl md:w-[20ch] mt-5 md:mt-[10%] font-semibold text-white">{movie.title}</h1>
            <p className="text-xs md:text-sm text-white mt-2 w-[30ch]">
              {truncateText(movie.overview, 150)} {/* Adjust the length as needed */}
            </p>
            <button className='p-2 text-sm text-white font-bold mt-4 bg-[#BE123C] rounded-lg flex gap-2 items-center'>
              <img className='w-5 fill-white' src={PlayIcon} alt="" />
              WATCH TRAILER
            </button>
          </div>
        </div>
      )}
      {!movie && <Loading />}
    </div>
  );
};

export default Banner;