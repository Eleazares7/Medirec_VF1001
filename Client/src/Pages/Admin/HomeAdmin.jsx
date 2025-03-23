// src/Components/AdminComponents/HomeAdmin.jsx

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin.jsx';
import { AuthContext } from '../../Context/AuthContext';
import { fetchAdminData } from '../../Services/adminService';
import AdminInfoCard from '../../Components/AdminComponents/HomeAdmin/AdminInfoCard.jsx';
import QuickLinkCard from '../../Components/AdminComponents/HomeAdmin/QuickLinkCard.jsx';
import CallToAction from '../../Components/AdminComponents/HomeAdmin/CallToAction.jsx';

const quickLinks = [
    { name: 'Gestionar Usuarios', url: '/admin/manageUsers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
    { name: 'Ver Reportes', url: '/admin/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Configuración', url: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z' },
];

const HomeAdmin = () => {
    const controls = useAnimation();
    const { user } = useContext(AuthContext);
    const [adminData, setAdminData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Petición al backend para obtener los datos del administrador
    useEffect(() => {
        const getAdminData = async () => {
            if (!user || !user.email) {
                navigate("/login");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const data = await fetchAdminData(user.email, token);
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
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        getAdminData();
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
                        <AdminInfoCard adminData={adminData} formatDate={formatDate} />
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickLinks.map((link, index) => (
                            <QuickLinkCard key={link.name} link={link} index={index} />
                        ))}
                    </div>

                    {/* Call to Action */}
                    <CallToAction />
                </motion.div>
            </div>
        </>
    );
};

export default HomeAdmin;