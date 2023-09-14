import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Logo from "../assets/logo.svg";
import Home from "../assets/home.svg";
import Mov from "../assets/movies.svg";
import Tv from "../assets/tv.svg";
import Upcoming from "../assets/upcoming.svg";
import Trailer from "../assets/trailer.svg";
import Logout from "../assets/logout.svg";
import Star from "../assets/star.svg";
import Dropdown from "../assets/dropdown.svg";
import Notif from "../assets/notif.svg";
import More from "../assets/more.svg";
import MoreLight from "../assets/more-light.svg";
import Header from "./Header";
import Loading from "./Loading";
import YouTube from "react-youtube"; // Import the YouTube component

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [directors, setDirectors] = useState([]);
  const [writers, setWriters] = useState([]);
  const [stars, setStars] = useState([]);
  const [releaseDateUTC, setReleaseDateUTC] = useState("");
  const [movieRating, setMovieRating] = useState(null);
  const TMDB_API_KEY = "bf0816c71498a511ab8ef58b56688fba";

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (response.data) {
          setMovieDetails(response.data);

          // Convert the release date to UTC
          const releaseDate = new Date(response.data.release_date);
          const releaseDateUTC = releaseDate.toUTCString();

          // Fetch movie credits to get director(s)
          const creditsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
          );

          if (creditsResponse.data && creditsResponse.data.crew) {
            const crew = creditsResponse.data.crew;

            // Extract director names
            const directors = crew
              .filter((member) => member.job === "Director")
              .map((director) => director.name);

            // Extract writer names
            const writers = crew
              .filter((member) => member.department === "Writing")
              .map((writer) => writer.name);

            // Extract star names (top billed cast)
            const stars = creditsResponse.data.cast
              .filter((cast) => cast.order < 5)
              .map((cast) => cast.name);

            setDirectors(directors);
            setWriters(writers);
            setStars(stars);
            setReleaseDateUTC(releaseDateUTC);
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
  }, [id]);

  // store the top-rated movie posters
  const [topRatedMoviePosters, setTopRatedMoviePosters] = useState([]);

  useEffect(() => {
    // Function to fetch top-rated movies
    const fetchTopRatedMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=1000`
        );

        if (response.data && response.data.results) {
          // Extract poster paths from the results
          const posters = response.data.results.map(
            (movie) => movie.poster_path
          );
          setTopRatedMoviePosters(posters.slice(0, 3)); // Get the top 3 posters
        } else {
          console.error("No top-rated movies found.");
        }
      } catch (error) {
        console.error("Error fetching top-rated movies:", error);
      }
    };

    fetchTopRatedMovies();
  }, []);

  // Store the trailer key
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    // Function to fetch the movie trailer
    const fetchMovieTrailer = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );

        if (response.data && response.data.results.length > 0) {
          const trailer = response.data.results.find(
            (video) => video.type === "Trailer"
          );

          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
      } catch (error) {
        console.error("Error fetching movie trailer:", error);
      }
    };

    fetchMovieTrailer();
  }, [id]);

  useEffect(() => {
    // Function to fetch the movie rating
    const fetchMovieRating = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
  
        if (response.data && response.data.vote_average) {
          // Format the rating with one decimal place
          const formattedRating = (response.data.vote_average * 10).toFixed(1);
          setMovieRating(formattedRating);
        } else {
          console.error("No movie rating data found.");
        }
      } catch (error) {
        console.error("Error fetching movie rating:", error);
      }
    };
  
    fetchMovieRating();
  }, [id, TMDB_API_KEY]);
  

  return (
    <div>
      <div className="md:hidden pt-8 p-4 bg-black">
        <Header />
      </div>
      <div className="flex w-[100%]">
        {/* Left Sidebar */}
        <div className="hidden md:block border-2 border-r-slate-300 h-[100vh] rounded-r-[50px]">
          <Link to="/">
            <div className="flex items-center gap-2 p-10 text-center justify-center cursor-pointer">
              <img className="w-8" src={Logo} alt="" />
              <p>MovieBox</p>
            </div>
          </Link>

          <div className="flex-col justify-center gap-4 w-[100%]">
            <div>
              <Link to="/">
                <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%] cursor-pointer">
                  <img className="w-5" src={Home} alt="" />
                  <p className="text-center">Home</p>
                </div>
              </Link>
              <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%] cursor-pointer">
                <img className="w-5" src={Mov} alt="" />
                <p>Movies</p>
              </div>
              <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%] cursor-pointer">
                <img className="w-5" src={Tv} alt="" />
                <p>Tv Series</p>
              </div>
              <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%] cursor-pointer">
                <img className="w-5" src={Upcoming} alt="" />
                <p>Upcoming</p>
              </div>
            </div>

            <div className="w-[120px] m-auto border-[0.3px] rounded-xl px-2 py-4 border-[#BE123C] bg-[#BE123C1A]">
              <p className="text-xs opacity-70">
                Play movie quizzes and earn free tickets
              </p>
              <p className="text-[10px] opacity-70">
                50k people are playing now
              </p>
              <button className="text-xs m-auto bg-[#be123d44] py-1 px-2 text-[#BE123C] rounded-lg">
                Start Playing
              </button>
            </div>

            <div className="flex gap-2 items-center p-4 hover:bg-[#BE123C1A] hover:border-r-2 border-r-[#BE123C] hover:text-[#BE123C] hover:font-bold w-[100%]">
              <img className="w-5" src={Logout} alt="" />
              <p>Log out</p>
            </div>
          </div>
        </div>

        {/* Movie Details */}
        <div className="p-6 w-[100%]">
          <div>
            <div
            // className="w-[100%] rounded-2xl"
            // style={{
            //   backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieDetails?.poster_path})`,
            //   backgroundSize: "cover",
            //   backgroundPosition: "center",
            //   backgroundRepeat: "no-repeat",
            //   minHeight: "300px",
            // }}
            >
              {/* Trailer */}
              <div className="my-4 rounded-xl">
                <div className="rounded-2xl overflow-hidden">
                  <YouTube
                    videoId={trailerKey}
                    opts={{
                      height: "390",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {/* <div className="flex justify-center items-center h-[300px]">
              <img src={Trailer} alt="" />
            </div> */}
            </div>
          </div>
          {loading ? (
            <p>
              <Loading />
            </p>
          ) : movieDetails ? (
            <div className="movie-details">
              <div className="my-4 flex justify-between items-center gap-2 flex-wrap">
                <p
                  data-testid="movie-title"
                  className="font-bold opacity-70 flex flex-wrap items-center gap-2"
                >
                  {movieDetails.title}.
                  <h2 data-testid="movie-release-date"> {releaseDateUTC}</h2>.{" "}
                  <h6
                    data-testid="movie-runtime"
                    className="font-bold"
                  >{`${movieDetails.runtime} Minuites`}</h6>
                  .
                  <h6 className="border-[1px] border-[#BE123C] rounded-lg p-1">
                    {movieDetails.genres.map((genre) => genre.name).join(" ")}
                  </h6>
                </p>
                <div className="flex items-center items-center gap-2">
  <img className="w-5" src={Star} alt="" />
  {movieRating !== null ? (
    <p className="text-xs"><span className="opacity-50">{movieRating}</span>/<span className="font-bold">350</span></p>
  ) : (
    <p className="text-xs">Rating not available</p>
  )}
</div>

              </div>

              <div>
                <div className="flex flex-col md:flex-row gap-2 w-[100%]">
                  <div className="w-[100%] md:w-[75%]">
                    <h6 data-testid="movie-overview">
                      {movieDetails.overview}
                    </h6>
                    <p className="mt-2">
                      Director:{" "}
                      <span className="text-[#BE123C]">
                        {directors.length > 1 ? "s" : ""} {directors.join(", ")}
                      </span>
                    </p>
                    <p>
                      Writers:{" "}
                      <span className="text-[#BE123C]">
                        {writers.join(", ")}
                      </span>
                    </p>
                    <p>
                      Stars:{" "}
                      <span className="text-[#BE123C]">{stars.join(", ")}</span>
                    </p>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center border-b pb-2 mt-2">
                      <p className="mr-2 bg-[#BE123C] rounded text-white py-1 px-4">
                        Top Rated Movie #65
                      </p>
                      <div className="relative">
                        <button
                          className="border rounded text-left px-6 py-1 flex items-center gap-3 ml-[-9px]"
                          onClick={toggleDropdown}
                        >
                          Award 9 Nominations
                          <img className="w-4" src={Dropdown} alt="" />
                        </button>
                        {isDropdownOpen && (
                          <div className="absolute border border-gray-300 mt-1 bg-white">
                            {/* Dropdown content */}
                            <p className="p-2 border-b">Movie 1</p>
                            <p className="p-2 border-b">Movie 2</p>
                            <p className="p-2">Movie 3</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-[100%] md:w-[25%]">
                    <div className="text-center">
                      <p className="bg-[#BE123C] text-white p-2 w-[100%] rounded flex justify-center items-center gap-2">
                        <img className="w-5" src={Notif} alt="" />
                        See Notification
                      </p>
                    </div>

                    <div className="text-center mt-2">
                      <p className="bg-[#BE123C1A] p-2 w-[100%] rounded flex justify-center items-center gap-2">
                        <img className="w-5" src={More} alt="" />
                        More Watch Options
                      </p>
                    </div>

                    <div>
                      <div className="mt-2 rounded w-fit">
                        <div className="flex gap-1">
                          {topRatedMoviePosters.map((posterPath, index) => (
                            <img
                              key={index}
                              src={`https://image.tmdb.org/t/p/original/${posterPath}`}
                              alt={`Best Movie ${index + 1}`}
                              className={`w-[80px] h-full${index > 0 ? 2 : 0}`}
                            />
                          ))}
                        </div>
                        <p className="bg-black bg-opacity-50 text-white p-1 w-[100%] rounded flex justify-center items-center gap-2 relative top-[-32px]">
                          <img className="w-5" src={MoreLight} alt="" />
                          Best Movies in September
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No movie details found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
