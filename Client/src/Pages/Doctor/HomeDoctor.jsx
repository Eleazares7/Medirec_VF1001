import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import NavbarDoctor from '../../Components/DoctorComponents/NavbarDoctor';

const HomeDoctor = () => {
  const { user } = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();

    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [user, navigate]);

  // Animación de entrada
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Datos simulados del backend para este ejemplo
  const simulatedDoctorData = {
    nombre: 'Diana Monserrat',
    apellido: 'Banda Rayo',
    especialidad: 'Cardiología',
    numero_licencia: '1254987639',
  };

  // Acciones disponibles para el doctor
  const actions = [
    { name: 'Ver Citas Médicas', url: '/doctor/appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Gestionar Pacientes', url: '/doctor/patients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
    { name: 'Configurar Horario', url: '/doctor/schedule', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Editar Perfil', url: '/doctor/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  if (isLoading) {
    return <div className="p-4 text-teal-800">Cargando datos del doctor...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <NavbarDoctor />
      <div className="min-h-screen bg-gray-100">
        <div className={`container mx-auto px-4 py-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {/* Sección de Bienvenida */}
          <div className="mb-8 rounded-lg bg-teal-800 p-6 text-white shadow-lg">
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              {/* Foto del Doctor */}
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Foto del médico"
                  className="h-24 w-24 rounded-full object-cover shadow-md transition-transform hover:scale-105"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-gray-600 shadow-md">
                  {(doctorData?.nombre || simulatedDoctorData.nombre).charAt(0)}
                  {(doctorData?.apellido || simulatedDoctorData.apellido).charAt(0)}
                </div>
              )}
              {/* Información del Doctor */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight">
                  ¡Bienvenid@, Dr(a). {doctorData?.nombre || simulatedDoctorData.nombre}{' '}
                  {doctorData?.apellido || simulatedDoctorData.apellido}!
                </h1>
                <p className="mt-2 text-lg text-teal-100">
                  Especialidad: {doctorData?.especialidad || simulatedDoctorData.especialidad}
                </p>
                <p className="text-sm text-teal-200">
                  Licencia Médica: {doctorData?.numero_licencia || simulatedDoctorData.numero_licencia}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Acciones */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((action) => (
              <Link
                key={action.name}
                to={action.url}
                className="group rounded-lg bg-white p-6 shadow-md transition-all hover:bg-teal-50 hover:shadow-lg"
              >
                <div className="flex flex-col items-center space-y-4">
                  <svg
                    className="h-10 w-10 text-teal-600 transition-transform group-hover:rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                  </svg>
                  <span className="text-center text-lg font-medium text-teal-800 transition-transform group-hover:translate-y-1">
                    {action.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDoctor;