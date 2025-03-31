import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/HomeComponents/NavBar'; // Ajusta la ruta según tu proyecto

const ManagementHistorial = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => setIsVisible(true), []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-gray-50 p-4">
            <Navbar />
            <div
                className={`container max-w-6xl mx-auto px-6 py-12 transition-all duration-700 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-teal-900 mb-12 text-center tracking-tight">
                    Panel de Control
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tarjeta de Historial de Citas Médicas */}
                    <div
                        onClick={() => handleNavigation('/patient/viewAppointments')}
                        className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-teal-500 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex items-center mb-4">
                            <svg
                                className="w-10 h-10 text-teal-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold text-teal-800">Historial de Citas Médicas</h2>
                        </div>
                        <p className="text-gray-600">
                            Consulta todas tus citas médicas pasadas y futuras en un solo lugar.
                        </p>
                    </div>

                    {/* Tarjeta de Historial de Recetas Médicas */}
                    <div
                        onClick={() => handleNavigation('/prescriptions')}
                        className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-amber-500 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex items-center mb-4">
                            <svg
                                className="w-10 h-10 text-amber-500 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold text-teal-800">Historial de Recetas Médicas</h2>
                        </div>
                        <p className="text-gray-600">
                            Revisa tus recetas médicas y sus detalles cuando lo necesites.
                        </p>
                    </div>

                    {/* Tarjeta de Historial de Compras */}
                    <div
                        onClick={() => handleNavigation('/purchases')}
                        className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-red-500 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex items-center mb-4">
                            <svg
                                className="w-10 h-10 text-red-500 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <h2 className="text-2xl font-semibold text-teal-800">Historial de Compras</h2>
                        </div>
                        <p className="text-gray-600">
                            Explora el historial de tus compras relacionadas con tu salud.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementHistorial;