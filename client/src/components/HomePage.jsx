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
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      {/* Hero Section */}
      <div
        className="hero-section text-white"
        style={{
          position: "relative",
          height: "80vh",
          background: "url('/netflix.jpg') no-repeat center center/cover", // Set the image as the background
        }}
      >
        {/* Semi-transparent Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5))",
            zIndex: 1,
          }}
        ></div>

        {/* Text Content */}
        <div
          className="text-center d-flex flex-column justify-content-center align-items-center"
          style={{
            position: "relative",
            height: "100%",
            zIndex: 2,
          }}
        >
          <h1 className="display-4 fw-bold">Welcome to Movie Explorer</h1>
          <p className="lead mb-4" style={{ maxWidth: "600px" }}>
            Discover amazing movies and TV shows in a sleek new way.
          </p>
          <div>
            <Link to="/login" className="btn btn-primary btn-lg me-3">
              Get Started
            </Link>
            <Link to="/search" className="btn btn-outline-light btn-lg">
              Browse Movies
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mt-5">
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
            Featured content is temporarily unavailable. Movie search is still available.
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
      </div>

      {/* Footer Section */}
      <footer
        className="text-center py-3"
        style={{
          backgroundColor: "#343a40", // Dark gray background for good contrast
          color: "#ffffff", // White text for visibility
        }}
      >
        <small>
          <Link
            to="#"
            style={{
              color: "#adb5bd", // Light gray for links
              textDecoration: "none",
              marginRight: "10px",
            }}
          >
            Privacy Policy
          </Link>
          |
          <Link
            to="#"
            style={{
              color: "#adb5bd", // Light gray for links
              textDecoration: "none",
              marginLeft: "10px",
            }}
          >
            Terms of Service
          </Link>
        </small>
      </footer>
    </div>
  );
}

export default HomePage;
