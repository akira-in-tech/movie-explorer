import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", { username, password, email });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Username taken or invalid data");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">Create an Account</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                required
                minLength="3"
                maxLength="40"
                autoComplete="username"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                required
                placeholder="Email"
                type="email"
                autoComplete="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                minLength="8"
                autoComplete="new-password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
