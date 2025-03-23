import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin';
import { AuthContext } from '../../Context/AuthContext';

const HomeAdmin = () => {
    const controls = useAnimation();
    const { user } = useContext(AuthContext);
    const [adminData, setAdminData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const navigate = useNavigate();

    // Petición al backend para obtener los datos del administrador
    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user || !user.email) {
                navigate("/login");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/admin/getAdmin/${user.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener datos del admin: ${response.statusText}`);
                }

                const data = await response.json();
                setAdminData(data);

                // Si hay una foto en los datos, generamos la URL
                if (data.fotoData && data.fotoData.data) {
                    const byteArray = new Uint8Array(data.fotoData.data);
                    const blob = new Blob([byteArray], { type: data.fotoMimeType || "image/jpeg" });
                    const url = URL.createObjectURL(blob);
                    setPhotoUrl(url);
                }
            } catch (error) {
                console.error("Error al cargar los datos del administrador:", error);
                navigate("/login"); // Redirige al login si hay un error (por ejemplo, token inválido)
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchAdminData();
    }, [user, navigate]);

    // Animación inicial cuando el componente se monta
    useEffect(() => {
        if (!loading && adminData) {
            controls.start({ opacity: 1, y: 0 });
        }
    }, [loading, adminData, controls]);

    // Limpieza de la URL de la foto al desmontar el componente
    useEffect(() => {
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [photoUrl]);

    const quickLinks = [
        { name: 'Gestionar Usuarios', url: '/admin/manageUsers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
        { name: 'Ver Reportes', url: '/admin/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Configuración', url: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z' },
    ];

    // Mientras se cargan los datos, mostrar un spinner
    if (loading || !adminData) {
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
                        <p className="text-teal-800 text-xl font-semibold">Cargando panel de administración...</p>
                    </div>
                </div>
            </>
        );
    }

    // Formatear las fechas para mostrarlas de manera legible
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <NavbarAdmin photoUrl={photoUrl} adminName={adminData?.nombre || user?.nombre} />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={controls}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold text-teal-800 mb-4"
                        >
                            Bienvenido, {adminData.nombre} {adminData.apellido}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 text-lg"
                        >
                            Gestiona usuarios, revisa reportes y configura el sistema desde aquí
                        </motion.p>
                    </div>

                    {/* Información del administrador */}
                    <div className="mb-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4, ease: 'easeInOut' }}
                            className="bg-teal-50 p-6 rounded-md shadow-md"
                        >
                            <h2 className="text-xl font-semibold text-teal-800 mb-4">
                                Información del Administrador
                            </h2>
                            <p className="text-gray-700">
                                <strong>Email:</strong> {adminData.email}
                            </p>
                            <p className="text-gray-700">
                                <strong>Teléfono:</strong> {adminData.telefono}
                            </p>
                            <p className="text-gray-700">
                                <strong>Estado:</strong> {adminData.estado}
                            </p>
                            <p className="text-gray-700">
                                <strong>Fecha de Registro:</strong> {formatDate(adminData.fecha_registro)}
                            </p>
                            <p className="text-gray-700">
                                <strong>Fecha de Inicio:</strong> {formatDate(adminData.fecha_inicio)}
                            </p>
                        </motion.div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ y: -8, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                className="bg-teal-50 p-6 rounded-md shadow-md transition-colors duration-300 hover:bg-teal-100"
                            >
                                <Link to={link.url} className="flex flex-col items-center text-center">
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
                                            d={link.icon}
                                        />
                                    </motion.svg>
                                    <h3 className="text-lg font-semibold text-teal-800 transition-colors duration-300 hover:text-teal-900">
                                        {link.name}
                                    </h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="mt-10 text-center">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <Link
                                to="/admin/dashboard"
                                className="inline-block px-8 py-3 bg-teal-600 text-white rounded-full font-medium shadow-md transition-colors duration-300 hover:bg-teal-500 hover:shadow-lg"
                            >
                                <motion.span
                                    className="flex items-center"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    Ir al Dashboard
                                    <svg
                                        className="w-5 h-5 ml-2"
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
                                </motion.span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default HomeAdmin;