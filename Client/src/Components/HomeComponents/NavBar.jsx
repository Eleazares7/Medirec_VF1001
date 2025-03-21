import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [patientData, setPatientData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Animación de entrada al montar el componente
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user || !user.email) {
        navigate("/login");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/users/patient/${user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener los datos del paciente: ${response.statusText}`);
        }

        const data = await response.json();
        setPatientData(data);

        if (data.fotoData && data.fotoData.data) {
          const byteArray = new Uint8Array(data.fotoData.data);
          const blob = new Blob([byteArray], { type: data.fotoMimeType || "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setPhotoUrl(url);
        }
      } catch (error) {
        console.error("Error al cargar los datos del paciente:", error);
      }
    };

    fetchPatientData();
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const navItems = [
    { name: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-10l2 2', url: "/home" },
    { name: 'Generar Cita', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', url: "/generate-appointment" },
    { name: 'Farmacia', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-12 0h-2M12 7v6m0 0l-3-3m3 3l3-3', url: "/pharmacy" },
    { name: 'Historial Médico', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', url: "/medical-history" },
    { name: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', url: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`bg-teal-800 text-white shadow-lg transition-all duration-700 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home">
              <span className="text-2xl font-bold tracking-tight transform hover:scale-105 transition-transform duration-300">
                MediRec
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

          {/* Profile and Logout - A la derecha */}
          <div className="hidden md:flex items-center space-x-3">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center">
                <span className="text-xl font-bold">{user?.nombre?.[0] || '?'}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-teal-600 text-white rounded-full font-medium
                hover:bg-teal-500 transform hover:scale-105 transition-all duration-300
                shadow-md hover:shadow-lg"
            >
              <span className="flex items-center">
                Cerrar Sesión
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
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
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
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-full font-medium
                hover:bg-teal-500 transform hover:scale-105 transition-all duration-300
                shadow-md hover:shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;