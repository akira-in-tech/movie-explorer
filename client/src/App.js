// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import SearchPage from "./components/SearchPage";
import DetailsPage from "./components/DetailsPage";
import AdminPage from "./components/AdminPage";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/:criteria" element={<SearchPage />} />
          <Route path="/details/:imdbID" element={<DetailsPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["ADMIN"]}>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
