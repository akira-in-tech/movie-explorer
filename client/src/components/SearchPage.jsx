// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useParams, useNavigate } from "react-router-dom";

// function SearchPage() {
//   const { criteria } = useParams();
//   const [query, setQuery] = useState(criteria || "");
//   const [results, setResults] = useState([]);
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (query.trim()) {
//       navigate(`/search/${encodeURIComponent(query)}`);
//     }
//   };

//   useEffect(() => {
//     if (criteria) {
//       axios
//         .get(
//           `http://www.omdbapi.com/?s=${encodeURIComponent(
//             criteria
//           )}&apikey=a0f0fad7`
//         )
//         .then((res) => setResults(res.data.Search || []));
//     }
//   }, [criteria]);

//   return (
//     <div>
//       <h2>Search Movies</h2>
//       <form onSubmit={handleSearch} className="mb-3">
//         <input
//           placeholder="Search"
//           className="form-control mb-2"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button className="btn btn-primary">Search</button>
//       </form>
//       <div className="row">
//         {results.map((r) => (
//           <div key={r.imdbID} className="col-3 mb-3">
//             <div className="card">
//               {r.Poster !== "N/A" && (
//                 <img src={r.Poster} className="card-img-top" alt={r.Title} />
//               )}
//               <div className="card-body">
//                 <h5 className="card-title">{r.Title}</h5>
//                 <Link
//                   to={`/details/${r.imdbID}`}
//                   className="btn btn-sm btn-primary"
//                 >
//                   Details
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SearchPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

function SearchPage() {
  const { criteria } = useParams();
  const [query, setQuery] = useState(criteria || "");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    if (criteria) {
      axios
        .get(
          `http://www.omdbapi.com/?s=${encodeURIComponent(
            criteria
          )}&apikey=a0f0fad7`
        )
        .then((res) => setResults(res.data.Search || []));
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
      {results.length > 0 ? (
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
