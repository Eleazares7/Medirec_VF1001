// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ element, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    console.log("Redirigiendo a /login: usuario no autenticado");
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    console.log("Redirigiendo a /: rol no coincide", user.role, "vs", allowedRole);
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;