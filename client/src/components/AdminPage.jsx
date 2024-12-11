import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const [featured, setFeatured] = useState("");
  const [current, setCurrent] = useState(null);
  const token = localStorage.getItem("token");
  const headers = { Authorization: "Bearer " + token };

  useEffect(() => {
    axios
      .get("http://localhost:5500/api/featured")
      .then((res) => setCurrent(res.data.featuredMovie));
  }, []);

  const handleSet = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:5500/api/featured",
      { imdbID: featured },
      { headers }
    );
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
