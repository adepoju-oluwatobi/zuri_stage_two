import React, { useState } from 'react';
import axios from 'axios';
import Search from '../assets/search.svg'

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const TMDB_API_KEY = 'bf0816c71498a511ab8ef58b56688fba';

  const handleSearch = async () => {
    try {
      if (query.trim() === '') {
        // Don't perform a search if the query is empty
        setSearchResults([]);
        return;
      }

      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
      );

      if (response.data && response.data.results && response.data.results.length > 0) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
        console.error('No search results found.');
      }
    } catch (error) {
      setSearchResults([]);
      console.error('Error performing movie search:', error);
    }
  };

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
            handleSearch();
          }
        }}
      />
      <img
        className="search-bar cursor-pointer"
        src={Search}
        alt="Search"
        onClick={handleSearch}
      />
      {searchResults.length > 0 && (
        <div className="absolute top-10 left-0 bg-white p-2 w-64 rounded-lg shadow-md">
          <p className="text-gray-800 font-semibold">Search Results</p>
          <ul>
            {searchResults.map((movie) => (
              <li key={movie.id}>
                <a
                  href={`/movie/${movie.id}`} // Replace with the appropriate link
                  className="block text-blue-500 hover:underline"
                >
                  {movie.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
