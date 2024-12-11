import {Link} from 'react-router-dom';
import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const [featured, setFeatured] = useState(null);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    axios
      .get("http://localhost:5500/api/featured")
      .then((res) => setFeatured(res.data.featuredMovie));
  }, []);

  return (
    <div>
      <h1>Welcome to Movie Explorer</h1>
      {!token && <p>Discover movies, see details, and read reviews.</p>}
      {token && user && (
        <p>Hi {user.username}, check out your bookmarks or leave a review!</p>
      )}
      {featured && <p>Featured Movie: {featured}</p>}
      <p>
        <small>
          <Link to="#">Privacy Policy</Link>
        </small>
      </p>
    </div>
  );
}

export default HomePage;
