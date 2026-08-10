import React, { useState, useEffect } from "react";
import api from "../api/client";

function AdminPage() {
  const [featured, setFeatured] = useState("");
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/featured")
      .then((res) => setCurrent(res.data.featuredMovie))
      .catch(() => setError("Unable to load featured movie."));
  }, []);

  const handleSet = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/featured", { imdbID: featured });
      setCurrent(res.data.featuredMovie);
      setFeatured("");
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Unable to update featured movie.");
    }
  };

  return (
    <div>
      <h2>Admin Page</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <p>Current featured: {current}</p>
      <form onSubmit={handleSet}>
        <input
          className="form-control mb-2"
          placeholder="imdbID"
          value={featured}
          onChange={(e) => setFeatured(e.target.value)}
        />
        <button className="btn btn-primary">Set Featured</button>
      </form>
    </div>
  );
}

export default AdminPage;
