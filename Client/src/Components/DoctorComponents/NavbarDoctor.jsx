import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const NavbarDoctor = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!user || !user.email) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/doctor/getDoctor/${user.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener los datos del doctor: ${response.statusText}`);
        }

        const data = await response.json();
        setDoctorData(data);

        if (data.foto && data.foto.data) {
          const byteArray = new Uint8Array(data.foto.data);
          const blob = new Blob([byteArray], { type: data.fotoMimeType || 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          setPhotoUrl(url);
        }
      } catch (error) {
        console.error('Error al cargar los datos del doctor:', error);
        setError(error.message);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [user, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-10l2 2', url: '/doctor/home' },
    { name: 'Citas Médicas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', url: '/doctor/appointments' },
    { name: 'Pacientes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197', url: '/doctor/patients' },
    { name: 'Horario', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', url: '/doctor/schedule' },
    { name: 'Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', url: '/doctor/profile' },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <nav className={`bg-teal-800 text-white shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/doctor/home" className="text-2xl font-bold tracking-tight transition-transform hover:scale-105">
            Doctor
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-center md:flex md:flex-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.url}
                className="group mx-1 flex items-center rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-teal-700 hover:text-teal-100"
              >
                <svg className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="transition-transform group-hover:translate-x-1">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop User Info */}
          <div className="hidden items-center space-x-4 md:flex">
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
              ) : photoUrl ? (
                <img src={photoUrl} alt="Foto del médico" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                  <span className="text-xs text-gray-600">
                    {doctorData?.nombre?.charAt(0) || 'D'}
                    {doctorData?.apellido?.charAt(0) || 'M'}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-teal-100">
                {isLoading ? 'Cargando...' : doctorData ? `Dr(a). ${doctorData.nombre} ${doctorData.apellido}` : 'Doctor(a)'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center rounded-full bg-teal-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:bg-teal-500 hover:shadow-lg"
            >
              Cerrar Sesión
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 text-teal-200 transition-all hover:bg-teal-700 hover:text-white focus:outline-none md:hidden"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="space-y-2 px-2 pb-3 pt-2">
            <div className="flex items-center space-x-2 px-3 py-2">
              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
              ) : photoUrl ? (
                <img src={photoUrl} alt="Foto del médico" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                  <span className="text-xs text-gray-600">
                    {doctorData?.nombre?.charAt(0) || 'D'}
                    {doctorData?.apellido?.charAt(0) || 'M'}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-teal-100">
                {isLoading ? 'Cargando...' : doctorData ? `Dr(a). ${doctorData.nombre} ${doctorData.apellido}` : 'Doctor(a)'}
              </span>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.url}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-teal-700 hover:text-teal-100"
              >
                <svg className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="transition-transform group-hover:translate-x-1">{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full rounded-full bg-teal-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:bg-teal-500 hover:shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDoctor;