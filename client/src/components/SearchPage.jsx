import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

function SearchPage() {
  const { criteria } = useParams();
  const [query, setQuery] = useState(criteria || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    if (criteria) {
      setLoading(true);
      setError("");
      api
        .get(`/api/movies/search?q=${encodeURIComponent(criteria)}`)
        .then((res) => setResults(res.data.results || []))
        .catch(() => {
          setResults([]);
          setError("Movie search is temporarily unavailable. Please try again.");
        })
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [criteria]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Search Movies</h2>
      <form
        onSubmit={handleSearch}
        className="mb-4 d-flex justify-content-center"
      >
        <input
          placeholder="Search for a movie..."
          className="form-control me-2"
          style={{ maxWidth: "300px" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>
      {loading ? (
        <div className="text-center mt-4" role="status">Searching…</div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">{error}</div>
      ) : results.length > 0 ? (
        <div className="row">
          {results.map((r) => (
            <div key={r.imdbID} className="col-md-3 col-sm-6 mb-3">
              <div className="card h-100 shadow-sm">
                {r.Poster !== "N/A" && (
                  <img src={r.Poster} className="card-img-top" alt={r.Title} />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{r.Title}</h5>
                  <Link
                    to={`/details/${r.imdbID}`}
                    className="btn btn-sm btn-primary mt-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : criteria ? (
        <div className="text-center mt-4">
          <p>No results found for "{criteria}". Try another keyword.</p>
        </div>
      ) : (
        <div className="text-center mt-4">
          <p>Try searching for your favorite movies above.</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
