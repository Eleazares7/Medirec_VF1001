import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin';

// Datos simulados para los doctores (esto sería reemplazado por datos reales del backend)
const mockDoctors = [
    { id: 1, nombre: "Dr. Juan Pérez", especialidad: "Cardiología", email: "juan.perez@hospital.com", estado: "Activo" },
    { id: 2, nombre: "Dra. María Gómez", especialidad: "Pediatría", email: "maria.gomez@hospital.com", estado: "Activo" },
    { id: 3, nombre: "Dr. Carlos López", especialidad: "Neurología", email: "carlos.lopez@hospital.com", estado: "Inactivo" },
];

const ManageDoctors = () => {
    const navigate = useNavigate();
    const [showList, setShowList] = useState(false); // Estado para mostrar la lista de doctores
    const [loading] = useState(false); // Estado de carga (por ahora falso, ya que usamos datos simulados)

    // Opciones de administración de doctores
    const doctorOptions = [
        {
            name: 'Lista de Doctores',
            description: 'Ver y gestionar la lista de doctores registrados.',
            action: () => setShowList(true), // Mostrar la lista en la misma pantalla
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197',
        },
        {
            name: 'Agregar un Doctor',
            description: 'Registrar un nuevo doctor en el sistema.',
            url: '/admin/users/addDoctor',
            icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
        {
            name: 'Reporte de Doctores',
            description: 'Generar un reporte con estadísticas de los doctores.',
            url: '/admin/doctors/report',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z',
        },
    ];

    // Mientras se verifica la autenticación o carga, mostrar un spinner (por consistencia)
    if (loading) {
        return (
            <>
                <NavbarAdmin />
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                        <svg
                            className="animate-spin h-10 w-10 text-teal-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <p className="text-teal-800 text-xl font-semibold">Cargando opciones de doctores...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarAdmin />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold text-teal-800 mb-4"
                        >
                            Administrar Doctores
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 text-lg"
                        >
                            Selecciona una opción para gestionar los doctores
                        </motion.p>
                    </div>

                    {/* Si se selecciona "Lista de Doctores", mostrar la tabla */}
                    {showList ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-teal-800">Lista de Doctores</h2>
                                <button
                                    onClick={() => setShowList(false)}
                                    className="inline-block px-6 py-2 bg-teal-600 text-white rounded-full font-medium shadow-md transition-colors duration-300 hover:bg-teal-500 hover:shadow-lg"
                                >
                                    <motion.span
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Volver a Opciones
                                    </motion.span>
                                </button>
                            </div>
                            <div className="bg-teal-50 p-6 rounded-md shadow-md">
                                {mockDoctors.length === 0 ? (
                                    <p className="text-gray-600 text-center">No hay doctores registrados.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-teal-800">
                                                    <th className="p-3">Nombre</th>
                                                    <th className="p-3">Especialidad</th>
                                                    <th className="p-3">Email</th>
                                                    <th className="p-3">Estado</th>
                                                    <th className="p-3">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mockDoctors.map((doctor, index) => (
                                                    <motion.tr
                                                        key={doctor.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                                        className="border-t border-teal-100 hover:bg-teal-100 transition-colors duration-300"
                                                    >
                                                        <td className="p-3">{doctor.nombre}</td>
                                                        <td className="p-3">{doctor.especialidad}</td>
                                                        <td className="p-3">{doctor.email}</td>
                                                        <td className="p-3">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-sm ${doctor.estado === 'Activo'
                                                                        ? 'bg-green-200 text-green-800'
                                                                        : 'bg-red-200 text-red-800'
                                                                    }`}
                                                            >
                                                                {doctor.estado}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 flex space-x-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-3 py-1 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-500 transition-colors duration-300"
                                                            >
                                                                Editar
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-3 py-1 bg-red-600 text-white rounded-md shadow-md hover:bg-red-500 transition-colors duration-300"
                                                            >
                                                                Eliminar
                                                            </motion.button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        // Mostrar las tarjetas de opciones si no se ha seleccionado "Lista de Doctores"
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {doctorOptions.map((option, index) => (
                                <motion.div
                                    key={option.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    whileHover={{ y: -8, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    className="bg-teal-50 p-6 rounded-md shadow-md transition-colors duration-300 hover:bg-teal-100"
                                >
                                    {option.url ? (
                                        <Link to={option.url} className="flex flex-col items-center text-center">
                                            <motion.svg
                                                whileHover={{ rotate: 12 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-12 h-12 text-teal-600 mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d={option.icon}
                                                />
                                            </motion.svg>
                                            <h3 className="text-lg font-semibold text-teal-800 transition-colors duration-300 hover:text-teal-900">
                                                {option.name}
                                            </h3>
                                            <p className="text-gray-600 mt-2">{option.description}</p>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={option.action}
                                            className="flex flex-col items-center text-center w-full"
                                        >
                                            <motion.svg
                                                whileHover={{ rotate: 12 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-12 h-12 text-teal-600 mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d={option.icon}
                                                />
                                            </motion.svg>
                                            <h3 className="text-lg font-semibold text-teal-800 transition-colors duration-300 hover:text-teal-900">
                                                {option.name}
                                            </h3>
                                            <p className="text-gray-600 mt-2">{option.description}</p>
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default ManageDoctors;