import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Logo from "../assets/logo.svg";
import Home from "../assets/home.svg";
import Mov from "../assets/movies.svg";
import Tv from "../assets/tv.svg";
import Upcoming from "../assets/upcoming.svg";
import Trailer from "../assets/trailer.svg";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [directors, setDirectors] = useState([]); // State for director(s) names
  const TMDB_API_KEY = "bf0816c71498a511ab8ef58b56688fba";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (response.data) {
          setMovieDetails(response.data);

          // Fetch movie credits to get director(s)
          const creditsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
          );

          if (creditsResponse.data && creditsResponse.data.crew) {
            // Find the director(s) in the crew
            const directors = creditsResponse.data.crew.filter(
              (member) => member.job === "Director"
            );

            // Extract director names and set the directors state variable
            const directorNames = directors.map((director) => director.name);
            setDirectors(directorNames);
          }
        } else {
          console.error("No movie details found.");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]); // Use "id" as a dependency

  return (
    <div className="flex w-[100%]">
      {/* Left Sidebar */}
      <div className="border-2 border-r-slate-300 h-[100vh] rounded-r-[50px]">
        <div className="flex items-center gap-2 p-10">
          <img className="w-8" src={Logo} alt="" />
          <p>MovieBox</p>
        </div>

        <div className="flex flex-col justify-center gap-4 mt-8 w-[100%]">
          <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%]">
            <img className="w-5" src={Home} alt="" />
            <p className="text-center">Home</p>
          </div>
          <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%]">
            <img className="w-5" src={Mov} alt="" />
            <p>Movies</p>
          </div>
          <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%]">
            <img className="w-5" src={Tv} alt="" />
            <p>Tv Series</p>
          </div>
          <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%]">
            <img className="w-5" src={Upcoming} alt="" />
            <p>Upcoming</p>
          </div>

          <div className="w-[120px] m-auto border-[0.3px] rounded-xl px-2 py-4 border-[#BE123C] bg-[#BE123C1A]">
            <p className="text-xs opacity-70">
              Play movie quizzes and earn free tickets
            </p>
            <p className="text-[10px] opacity-70">50k people are playing now</p>
            <button className="text-xs m-auto bg-[#be123d44] py-1 px-2 text-[#BE123C] rounded-lg">
              Start Playing
            </button>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-6 w-[100%]">
        <div>
          <div
            className="w-[100%] rounded-2xl"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieDetails?.poster_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "300px", // Set a minimum height for the background div
            }}
          >
            <div className="flex justify-center items-center h-[300px]">
              <img src={Trailer} alt="" />
            </div>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : movieDetails ? (
          <div className="movie-details">
            <div className="my-4">
              <p
                data-testid="movie-title"
                className="font-bold opacity-70 flex items-center gap-2"
              >
                {movieDetails.title}.
                <h2 data-testid="movie-release-date">
                  {" "}
                  {movieDetails.release_date &&
                    movieDetails.release_date.slice(0, 4)}
                </h2>
                .{" "}
                <h6
                  data-testid="movie-runtime"
                  className="font-bold"
                >{`${movieDetails.runtime} Minuites`}</h6>
                .
                <h6 className="border-[1px] border-[#BE123C] rounded-lg p-1">
                  {movieDetails.genres.map((genre) => genre.name).join(" ")}
                </h6>
              </p>
            </div>
            <div>
              <div className="flex">
                <div>
                  <h6 data-testid="movie-overview">{movieDetails.overview}</h6>
                  <p className="mt-2">
                    Director: <span className="text-[#BE123C]">{directors.length > 1 ? "s" : ""}:{" "}
                    {directors.join(", ")}</span>
                  </p>
                </div>
                <div>side one</div>
              </div>
            </div>
          </div>
        ) : (
          <p>No movie details found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
