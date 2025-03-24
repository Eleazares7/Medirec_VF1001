import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link de react-router-dom para la navegación

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animación de entrada al montar el componente
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navItems = [
    { name: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-10l2 2', url: "/" },
    { name: 'Citas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', url: "/medicalAppointments" },
    { name: 'Farmacia', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-12 0h-2M12 7v6m0 0l-3-3m3 3l3-3', url: "/pharmacy" },
    { name: 'Servicios', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', url: "/services" },
  ];

  return (
    <nav
      className={`bg-teal-800 text-white shadow-lg transition-all duration-700 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <span className="text-2xl font-bold tracking-tight transform hover:scale-105 transition-transform duration-300">
                Medirec
              </span>
            </Link>
          </div>

          {/* Desktop Menu - Centrado */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className="group px-4 py-2 flex items-center text-sm font-medium rounded-md
                    hover:bg-teal-700 hover:text-teal-100 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={item.icon}
                    />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Botones Login y Registro - A la derecha */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Botón Login */}
            <Link to="/login">
              <button
                className="px-4 py-2 bg-white text-teal-800 rounded-full font-medium
                  hover:bg-teal-100 transform hover:scale-105 transition-all duration-300
                  shadow-md hover:shadow-lg"
              >
                <span className="flex items-center">
                  Login
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </Link>

            {/* Botón Registro */}
            <Link to="/registerPatient">
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded-full font-medium
                  hover:bg-teal-500 transform hover:scale-105 transition-all duration-300
                  shadow-md hover:shadow-lg"
              >
                <span className="flex items-center">
                  Registro
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md
                text-teal-200 hover:text-white hover:bg-teal-700 focus:outline-none
                transition-all duration-300"
            >
              <span className="sr-only">Abrir menú</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.url}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md
                  hover:bg-teal-700 hover:text-teal-100 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {item.name}
                </span>
              </Link>
            ))}
            {/* Botón Login en Mobile */}
            <Link to="/login">
              <button
                className="w-full px-4 py-2 bg-white text-teal-800 rounded-full font-medium
                  hover:bg-teal-100 transform hover:scale-105 transition-all duration-300
                  shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </Link>
            {/* Botón Registro en Mobile */}
            <Link to="/registerPatient">
              <button
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-full font-medium
                  hover:bg-teal-500 transform hover:scale-105 transition-all duration-300
                  shadow-md hover:shadow-lg"
              >
                Registro
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;