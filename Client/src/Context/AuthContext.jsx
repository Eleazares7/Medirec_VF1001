// src/Context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      console.log("Token al recargar:", token);
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/login/verify", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          console.log("Respuesta de /verify:", data);

          if (response.ok) {
            setUser({
              id: data.id,
              email: data.email,
              role: data.role,
            });
            console.log("Usuario establecido:", { id: data.id, email: data.email, role: data.role });
          } else {
            localStorage.removeItem("token");
            setUser(null);
            console.log("Token no válido:", data.message);
          }
        } catch (error) {
          console.error("Error al verificar el token:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        console.log("No hay token en localStorage");
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    console.log("Login exitoso:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Cargando...</div>}
    </AuthContext.Provider>
  );
};