// MedicalReportsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaChartLine, FaUserMd, FaDollarSign } from 'react-icons/fa';
import Navbar from '../Components/NavBar';

const MedicalReportsSection = () => {
    const reports = [
        {
            id: 1,
            title: 'Informe de Consulta General',
            description: 'Obtén un resumen detallado de tu consulta médica para tu tranquilidad.',
            price: '$99',
            icon: FaFileAlt,
        },
        {
            title: 'Informe de Análisis Clínico',
            description: 'Recibe tus resultados de laboratorio explicados de forma sencilla.',
            price: '$149',
            icon: FaChartLine,
        },
        {
            title: 'Informe de Seguimiento Especialista',
            description: 'Mantén un registro de tu progreso con especialistas, ¡fácil y accesible!',
            price: '$199',
            icon: FaUserMd,
        },
        {
            title: 'Factura de Consulta Virtual',
            description: 'Descarga tu recibo y factura de citas online en un solo clic.',
            price: '$99',
            icon: FaDollarSign,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.7, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 },
        },
        hover: {
            scale: 1.05,
            y: -10,
            rotate: 2,
            transition: { duration: 0.3, ease: 'easeOut' },
        },
    };

    const iconVariants = {
        hover: {
            rotate: 360,
            transition: { duration: 1, ease: 'linear' },
        },
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <motion.section
                className="w-full flex-1 bg-[#006D77] text-white flex flex-col items-center relative overflow-hidden pt-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                {/* Fondo animado */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#004D61] via-[#006D77] to-[#26A69A]"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    style={{ backgroundSize: '200% 200%' }}
                />
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,109,119,0.3)_70%)]" />
                </motion.div>
                <motion.svg
                    className="absolute top-10 left-10 w-32 h-32 text-teal-600 opacity-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <path stroke="currentColor" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                </motion.svg>
                <motion.svg
                    className="absolute bottom-20 right-20 w-40 h-40 text-teal-500 opacity-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ y: [-20, 0, -20] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>

                {/* Texto descriptivo orientado al público */}
                <motion.div className="text-center mb-4 z-10" variants={titleVariants}>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Mantén el Control de tu Salud con Nuestros Informes
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-white mt-4">
                        Accede a tus informes médicos desde solo $99 pesos. ¡Todo lo que necesitas para tu tranquilidad en un solo lugar!
                    </p>
                </motion.div>

                {/* Cuadrícula de informes */}
                <div className="container mx-auto px-6 z-10 flex-1 w-full flex items-center justify-center">
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full h-full"
                        variants={containerVariants}
                    >
                        {reports.map((report, index) => (
                            <motion.div
                                key={index}
                                className="relative bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 border border-[#26A69A]/20 flex flex-col h-full"
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                {/* Fondo animado dentro de cada tarjeta */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-[#004D61] via-[#006D77] to-[#26A69A]"
                                    animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                    style={{ backgroundSize: '200% 200%', zIndex: 0 }}
                                />
                                <motion.div
                                    className="absolute inset-0 opacity-30"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(38,166,154,0.3)_70%)]" />
                                </motion.div>
                                <motion.svg
                                    className="absolute top-4 left-4 w-12 h-12 text-teal-600 opacity-20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <path stroke="currentColor" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                                </motion.svg>
                                <motion.svg
                                    className="absolute bottom-4 right-4 w-12 h-12 text-teal-500 opacity-20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    animate={{ y: [-10, 0, -10] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </motion.svg>

                                <div className="relative p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        {/* Ícono alineado al inicio */}
                                        <motion.div
                                            className="mb-4 bg-[#26A69A] text-white p-3 rounded-full inline-flex items-center justify-center"
                                            variants={iconVariants}
                                            whileHover="hover"
                                        >
                                            <report.icon className="w-6 h-6" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{report.title}</h3>
                                        <p className="text-white text-sm mb-4">{report.description}</p>
                                        <p className="text-white text-sm font-medium mt-2">
                                            Precio: <span className="font-bold">{report.price}</span>
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <button className="bg-[#26A69A] text-white px-4 py-2 rounded-full hover:bg-[#1f8d82] transition-colors">
                                            Obtener Ahora
                                        </button>
                                    </div>
                                    <motion.div
                                        className="h-1 bg-gradient-to-r from-[#004D61] to-[#26A69A] mt-4"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default MedicalReportsSection;