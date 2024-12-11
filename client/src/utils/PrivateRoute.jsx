import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

export default PrivateRoute;
