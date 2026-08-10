import React, { useState, useEffect } from "react";
import api from "../api/client";

function AdminPage() {
  const [featured, setFeatured] = useState("");
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    api
      .get("/api/featured")
      .then((res) => setCurrent(res.data.featuredMovie));
  }, []);

  const handleSet = async (e) => {
    e.preventDefault();
    const res = await api.post("/api/featured", { imdbID: featured });
    setCurrent(res.data.featuredMovie);
  };

  return (
    <div>
      <h2>Admin Page</h2>
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
