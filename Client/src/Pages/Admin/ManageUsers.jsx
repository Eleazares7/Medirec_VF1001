import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin';
import { AuthContext } from '../../Context/AuthContext';

const ManageUsers = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga

    // Simulamos una verificación de autenticación (similar a HomeAdmin.jsx)
    useEffect(() => {
        if (!user || !user.email) {
            navigate("/login");
            return;
        }
        setLoading(false); // No estamos cargando datos del backend, así que terminamos la carga
    }, [user, navigate]);

    // Opciones de usuarios para administrar
    const userTypes = [
        {
            name: 'Médicos',
            description: 'Gestiona los médicos del sistema, incluyendo sus especialidades y estados.',
            url: '/admin/users/manageDoctors',
            icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
        },
        {
            name: 'Pacientes',
            description: 'Administra los pacientes, revisa sus datos y actualiza su información.',
            url: '/admin/users/patients',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197',
        },
        {
            name: 'Administradores',
            description: 'Gestiona otros administradores del sistema y sus permisos.',
            url: '/admin/users/admins',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z',
        },
    ];

    // Mientras se verifica la autenticación, mostrar un spinner
    if (loading) {
        return (
            <>
                <NavbarAdmin photoUrl={photoUrl} adminName={user?.nombre} />
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
                        <p className="text-teal-800 text-xl font-semibold">Cargando opciones de administración...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarAdmin photoUrl={photoUrl} adminName={user?.nombre || "Administrador"} />
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
                            Administrar Usuarios
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 text-lg"
                        >
                            Selecciona el tipo de usuarios que deseas administrar
                        </motion.p>
                    </div>

                    {/* Tarjetas de opciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {userTypes.map((type, index) => (
                            <motion.div
                                key={type.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ y: -8, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                className="bg-teal-50 p-6 rounded-md shadow-md transition-colors duration-300 hover:bg-teal-100"
                            >
                                <Link to={type.url} className="flex flex-col items-center text-center">
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
                                            d={type.icon}
                                        />
                                    </motion.svg>
                                    <h3 className="text-lg font-semibold text-teal-800 transition-colors duration-300 hover:text-teal-900">
                                        {type.name}
                                    </h3>
                                    <p className="text-gray-600 mt-2">{type.description}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ManageUsers;