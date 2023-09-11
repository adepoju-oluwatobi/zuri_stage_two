import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Search from '../assets/search.svg';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const TMDB_API_KEY = 'bf0816c71498a511ab8ef58b56688fba';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
        );

        if (response.data && response.data.results && response.data.results.length > 0) {
          setSearchResults(response.data.results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error performing movie search:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        className="border border-white bg-transparent placeholder-white rounded-lg py-2 px-4 w-64 focus:outline-none focus:border-blue-500"
        placeholder="Search for movies by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
          }
        }}
      />
      <img
        className="search-bar cursor-pointer"
        src={Search}
        alt="Search"
        onClick={() => setQuery(query.trim())}
      />
      {loading && <p className="absolute top-10 left-0 text-white">Loading...</p>}
      {searchResults.length > 0 && (
        <div className="absolute top-10 left-0 bg-white p-2 w-64 rounded-lg shadow-md">
          <p className="text-gray-800 font-semibold">Search Results</p>
          <ul>
            {searchResults.map((movie) => (
              <li key={movie.id}>
                <Link to={`/movie/${movie.id}`}>
                  {/* Use Link to navigate to the movie details */}
                  {movie.title} ({movie.release_date && movie.release_date.slice(0, 4)})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
