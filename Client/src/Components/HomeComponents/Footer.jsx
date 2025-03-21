// src/Components/Footer.jsx
import React, { useState, useEffect } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activa la animación al montar el componente
    const timer = setTimeout(() => setIsVisible(true), 100); // Ligero retraso para la carga
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer
      className={`max-w-6xl mx-auto text-center py-8 transition-all duration-1000 ease-in-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-teal-800 text-white rounded-lg shadow-lg p-6">
        <p
          className="text-lg font-semibold animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          © {new Date().getFullYear()} MediRec - Cuidarte es nuestro compromiso
        </p>
        <div className="mt-4 flex justify-center gap-6">
          {[
            { name: "Acerca de", path: "/about" },
            { name: "Contacto", path: "/contact" },
            { name: "Términos", path: "/terms" },
            { name: "Privacidad", path: "/privacy" },
          ].map((link, index) => (
            <a
              key={link.name}
              href={link.path}
              className="text-teal-200 hover:text-teal-100 font-medium transition-colors duration-300 transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;