import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Navbar from '../../Components/HomeComponents/NavBar';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import Swal from 'sweetalert2'; // Importar SweetAlert2

// Estilos de las librerías
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';

const CreateAppointment = () => {
  const { user } = useContext(AuthContext); // user contiene { id: 10, email: 'eleazarprogrammeres7@gmail.com', role: 1 }
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [doctors, setDoctors] = useState([]); // Lista de médicos
  const [formData, setFormData] = useState({
    id_paciente: user.id, // El paciente es el usuario autenticado
    id_medico: '',
    fecha_consulta: new Date(),
    hora_consulta: '10:00',
    motivo: '',
    estado: 'Pendiente',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Animación de entrada
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Obtener lista de médicos desde el endpoint
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/users/getAllDoctors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener la lista de médicos');
        }

        const data = await response.json();
        setDoctors(data); // Asumimos que data es un array de médicos
      } catch (err) {
        console.error('Error al cargar los médicos:', err);
        setError('No se pudo cargar la lista de médicos.');
      }
    };

    fetchDoctors();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de fecha
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fecha_consulta: date }));
  };

  // Manejar cambio de hora
  const handleTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, hora_consulta: time }));
  };

  // Manejar envío del formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users/createAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_paciente: formData.id_paciente,
          id_medico: formData.id_medico,
          fecha_consulta: formData.fecha_consulta.toISOString().split('T')[0], // Formato YYYY-MM-DD
          hora_consulta: formData.hora_consulta,
          motivo: formData.motivo,
          estado: formData.estado,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la cita');
      }

      const data = await response.json();

      // Mostrar notificación de éxito con SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: '¡Cita creada!',
        text: data.message || 'Cita médica creada exitosamente.',
        timer: 2000, // Se cierra automáticamente después de 2 segundos
        showConfirmButton: false,
      });

      // Redirigir a /patient/home
      navigate('/patient/home');
    } catch (err) {
      console.error('Error al crear la cita:', err);
      setError(err.message || 'Ocurrió un error al crear la cita.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-100 flex items-center justify-center py-12">
        <div
          className={`container max-w-3xl mx-auto px-6 py-10 transition-all duration-700 ease-in-out transform ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-8 text-center tracking-tight animate-bounce">
            Crear Nueva Cita Médica
          </h1>
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-teal-600 transform transition-all duration-500 hover:shadow-3xl">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 animate-slide-in">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group">
                <label className="block text-teal-800 font-semibold mb-2 transition-all duration-300 group-hover:text-teal-600">
                  Médico
                </label>
                <div className="relative">
                  <select
                    name="id_medico"
                    value={formData.id_medico}
                    onChange={handleInputChange}
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:bg-gray-100 appearance-none"
                    required
                  >
                    <option value="">Selecciona un médico</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id_medico} value={doctor.id_medico}>
                        {doctor.nombre} {doctor.apellido} - {doctor.especialidad}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="group">
                <label className="block text-teal-800 font-semibold mb-2 transition-all duration-300 group-hover:text-teal-600">
                  Fecha de la Consulta
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.fecha_consulta}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:bg-gray-100"
                    minDate={new Date()}
                    required
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="group">
                <label className="block text-teal-800 font-semibold mb-2 transition-all duration-300 group-hover:text-teal-600">
                  Hora de la Consulta
                </label>
                <div className="relative">
                  <TimePicker
                    onChange={handleTimeChange}
                    value={formData.hora_consulta}
                    disableClock={true}
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:bg-gray-100"
                    required
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="group">
                <label className="block text-teal-800 font-semibold mb-2 transition-all duration-300 group-hover:text-teal-600">
                  Motivo de la Consulta
                </label>
                <div className="relative">
                  <textarea
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    className="w-full p-4 pl-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:bg-gray-100 resize-none"
                    rows="5"
                    placeholder="Describe el motivo de la consulta..."
                    required
                  />
                  <svg
                    className="absolute left-4 top-5 h-5 w-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
              </div>
              <div className="group">
                <label className="block text-teal-800 font-semibold mb-2 transition-all duration-300 group-hover:text-teal-600">
                  Estado
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.estado}
                    className="w-full p-4 pl-12 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed transition-all duration-300"
                    readOnly
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-teal-600 font-medium">
                    Pendiente
                  </span>
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`relative px-8 py-4 bg-teal-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform ${
                    isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-teal-700 hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95'
                  } group flex items-center justify-center mx-auto`}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                  {isLoading ? 'Creando...' : 'Crear Cita Médica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .react-datepicker-wrapper,
        .react-time-picker {
          width: 100%;
        }
        .react-datepicker-popper {
          z-index: 50 !important;
        }
        .react-datepicker {
          font-family: 'Inter', sans-serif;
          border: none;
          background: white;
          @apply rounded-lg shadow-lg border border-gray-200;
        }
        .react-datepicker__header {
          @apply bg-teal-600 text-white border-b-0 p-4 rounded-t-lg;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          @apply bg-teal-600 text-white rounded-lg;
        }
        .react-datepicker__day:hover {
          @apply bg-teal-50 rounded-lg;
        }
        .react-time-picker__wrapper {
          border: none !important;
        }
        .react-time-picker__inputGroup {
          @apply bg-gray-50 rounded-lg p-2;
        }
        .react-time-picker__inputGroup__input {
          @apply text-gray-800 font-sans;
        }
        .react-time-picker__inputGroup__input:focus {
          @apply outline-none ring-2 ring-teal-500;
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default CreateAppointment;