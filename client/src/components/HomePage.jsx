import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const [featured, setFeatured] = useState(null);
  const [featuredError, setFeaturedError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/api/featured")
      .then((res) => {
        const imdbID = res.data.featuredMovie;
        if (!imdbID) return null;
        return api.get(`/api/movies/${imdbID}`);
      })
      .then((movieRes) => {
        if (movieRes) setFeatured(movieRes.data);
      })
      .catch(() => setFeaturedError(true));
  }, []);

  return (
    <div className="movie-home">
      <section className="movie-hero text-white">
        <div className="movie-hero-content text-center d-flex flex-column justify-content-center align-items-center">
          <p className="movie-eyebrow">YOUR NEXT GREAT WATCH</p>
          <h1 className="display-3 fw-bold">Find a story worth your time.</h1>
          <p className="lead mb-4 movie-hero-copy">
            Search the catalog, compare community reviews, and keep a personal
            watchlist in one focused workspace.
          </p>
          <div>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-lg me-3">
                Create account
              </Link>
            )}
            <Link to="/search" className="btn btn-outline-light btn-lg">
              Explore movies
            </Link>
          </div>
        </div>
      </section>

      <main className="container py-5">
        {featured && (
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Featured: {featured.Title}</h5>
              <p className="card-text mb-2">{featured.Plot}</p>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                Discover more movies and TV shows by browsing our library!
              </p>
            </div>
          </div>
        )}

        {featuredError && (
          <div className="alert alert-warning" role="status">
            Featured content is temporarily unavailable. Movie search is still
            available.
          </div>
        )}

        {!user && (
          <div className="alert alert-info">
            <strong>Tip:</strong> Create an account or log in to bookmark your
            favorite movies and leave reviews.
          </div>
        )}

        {user && (
          <div className="alert alert-success">
            Logged in as <strong>{user.username}</strong>. Feel free to{" "}
            <Link to="/profile">edit your profile</Link> or{" "}
            <Link to="/search">search for a movie</Link>.
          </div>
        )}
      </main>

      <footer className="movie-footer text-center py-4">
        <small>Movie data is provided by OMDb. Built as a portfolio demo.</small>
      </footer>
    </div>
  );
}

export default HomePage;
