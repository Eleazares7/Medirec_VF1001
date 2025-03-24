import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import Navbar from '../../Components/HomeComponents/NavBar';

const ManagementAppointments = () => {
    const { user } = useContext(AuthContext); // user contiene { id: 10, email: 'eleazarprogrammeres7@gmail.com', role: 1 }
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    // Animación de entrada
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Funciones para navegar a las diferentes secciones
    const handleScheduleAppointment = () => {
        navigate('/patient/createAppointment');
    };

    const handleViewHistory = () => {
        navigate('/patient/appointment-history');
    };

    const handleViewActiveAppointments = () => {
        navigate('/patient/active-appointments');
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-100 flex items-center justify-center py-12">
                <div
                    className={`container max-w-4xl mx-auto px-6 py-10 transition-all duration-700 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                        }`}
                >
                    {/* Título con animación */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 mb-12 text-center tracking-tight animate-bounce">
                        Gestión de Citas Médicas
                    </h1>

                    {/* Contenedor de opciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Opción: Agendar Cita */}
                        <div
                            className="bg-white rounded-2xl shadow-2xl p-6 border-t-4 border-teal-600 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 cursor-pointer group"
                            onClick={handleScheduleAppointment}
                        >
                            <div className="flex flex-col items-center text-center">
                                <svg
                                    className="h-16 w-16 text-teal-600 mb-4 transition-transform duration-300 group-hover:scale-110"
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
                                <h2 className="text-2xl font-bold text-teal-800 mb-2 transition-all duration-300 group-hover:text-teal-600">
                                    Agendar Cita
                                </h2>
                                <p className="text-gray-600">Crea una nueva cita con el médico de tu elección.</p>
                            </div>
                        </div>

                        {/* Opción: Historial de Citas */}
                        <div
                            className="bg-white rounded-2xl shadow-2xl p-6 border-t-4 border-teal-600 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 cursor-pointer group"
                            onClick={handleViewHistory}
                        >
                            <div className="flex flex-col items-center text-center">
                                <svg
                                    className="h-16 w-16 text-teal-600 mb-4 transition-transform duration-300 group-hover:scale-110"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h2 className="text-2xl font-bold text-teal-800 mb-2 transition-all duration-300 group-hover:text-teal-600">
                                    Historial de Citas
                                </h2>
                                <p className="text-gray-600">Consulta todas tus citas pasadas y detalles.</p>
                            </div>
                        </div>

                        {/* Opción: Citas Activas */}
                        <div
                            className="bg-white rounded-2xl shadow-2xl p-6 border-t-4 border-teal-600 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 cursor-pointer group"
                            onClick={handleViewActiveAppointments}
                        >
                            <div className="flex flex-col items-center text-center">
                                <svg
                                    className="h-16 w-16 text-teal-600 mb-4 transition-transform duration-300 group-hover:scale-110"
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
                                <h2 className="text-2xl font-bold text-teal-800 mb-2 transition-all duration-300 group-hover:text-teal-600">
                                    Citas Activas
                                </h2>
                                <p className="text-gray-600">Visualiza tus citas programadas o en curso.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos personalizados */}
            <style jsx global>{`
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

export default ManagementAppointments;