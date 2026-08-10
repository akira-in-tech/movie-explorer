import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function DetailsPage() {
  const { imdbID } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    api.get(`/api/movies/${imdbID}`).then((res) => setMovie(res.data));
    api
      .get(`/api/reviews?movieId=${imdbID}`)
      .then((res) => setReviews(res.data));
  }, [imdbID]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to review");
      return;
    }
    await api.post("/api/reviews", { movieId: imdbID, text, rating });
    const updated = await api.get(`/api/reviews?movieId=${imdbID}`);
    setReviews(updated.data);
    setText("");
    setRating("");
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div>
      <h2>
        {movie.Title} ({movie.Year})
      </h2>
      <p>{movie.Plot}</p>
      <h3>Reviews</h3>
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
            className="form-control mb-2"
            placeholder="Rating 0-10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <button className="btn btn-primary">Submit Review</button>
        </form>
      )}
    </div>
  );
}

export default DetailsPage;
