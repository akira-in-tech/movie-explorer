import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function DetailsPage() {
  const { imdbID } = useParams();
  const { user, updateUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const bookmarked = Boolean(user?.bookmarks?.includes(imdbID));

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      api.get(`/api/movies/${imdbID}`),
      api.get(`/api/reviews?movieId=${imdbID}`),
    ])
      .then(([movieRes, reviewsRes]) => {
        setMovie(movieRes.data);
        setReviews(reviewsRes.data);
      })
      .catch(() => setError("Movie details are temporarily unavailable."))
      .finally(() => setLoading(false));
  }, [imdbID]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to review");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/api/reviews", { movieId: imdbID, text, rating });
      const updated = await api.get(`/api/reviews?movieId=${imdbID}`);
      setReviews(updated.data);
      setText("");
      setRating("");
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    setBookmarking(true);
    setError("");
    try {
      const endpoint = `/api/users/bookmark/${imdbID}`;
      const response = bookmarked
        ? await api.delete(endpoint)
        : await api.post(endpoint);
      updateUser({ ...user, bookmarks: response.data.bookmarks });
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Failed to update bookmark.");
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) return <div role="status">Loading…</div>;
  if (!movie) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>
        {movie.Title} ({movie.Year})
      </h2>
      <p>{movie.Plot}</p>
      {user && (
        <button
          type="button"
          className={`btn mb-3 ${bookmarked ? "btn-success" : "btn-outline-primary"}`}
          onClick={handleBookmark}
          disabled={bookmarking}
        >
          {bookmarking ? "Saving…" : bookmarked ? "Bookmarked" : "Add bookmark"}
        </button>
      )}
      <h3>Reviews</h3>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {reviews.map((r) => (
        <div key={r._id}>
          <p>
            {r.text} -{" "}
            <Link to={`/profile/${r.userId?._id}`}>{r.userId?.username}</Link>
          </p>
        </div>
      ))}
      {user && (
        <form onSubmit={handleReview}>
          <textarea
            className="form-control mb-2"
            placeholder="Write a review"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            required
            className="form-control mb-2"
            placeholder="Rating 0-10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <button className="btn btn-primary" disabled={submitting || !text.trim()}>
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}

export default DetailsPage;
