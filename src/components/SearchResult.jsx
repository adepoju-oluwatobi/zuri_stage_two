import React from 'react';
import { Link } from 'react-router-dom';

const SearchResult = ({ movie }) => {
  return (
    <li className='text-black hover:bg-slate-400 hover:text-white p-2 '>
      <Link to={`/movies/${movie.id}`}>
        <div className="flex items-center">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={`${movie.title} Poster`}
              className="h-20 mr-2"
            />
          )}
          <div>
            <p>{movie.title}</p>
            {movie.release_date && (
              <p>({movie.release_date.slice(0, 4)})</p>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SearchResult;
