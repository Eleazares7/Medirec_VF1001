// ServicesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaCalendarAlt, FaShoppingCart, FaHeadset, FaStethoscope } from 'react-icons/fa';
import Navbar from '../Components/NavBar';
import Image1 from '../Images/MedicalAppointment.jpg';
import Image2 from '../Images/PersonalConsultation.jpg';
import Image3 from '../Images/ServicesAndCare.jpg';
import Image4 from '../Images/PayOnLine.jpg';
import Image5 from '../Images/Pharmacy.jpg';

const ServicesSection = () => {
    const services = [
        {
            title: 'Consulta Virtual',
            description: 'Agenda citas médicas desde la comodidad de tu hogar con nuestros especialistas.',
            image: Image1,
            icon: FaVideo,
        },
        {
            title: 'Citas Rápidas',
            description: 'Reserva citas en minutos con nuestro sistema fácil y rápido.',
            image: Image2,
            icon: FaCalendarAlt,
        },
        {
            title: 'Farmacia Online',
            description: 'Compra medicamentos y recíbelos en tu puerta con un solo clic.',
            image: Image3,
            icon: FaShoppingCart,
        },
        {
            title: 'Soporte 24/7',
            description: 'Nuestro equipo está disponible para ayudarte en cualquier momento.',
            image: Image4,
            icon: FaHeadset,
        },
        {
            title: 'Telemedicina',
            description: 'Recibe atención médica a distancia con tecnología de punta.',
            image: Image5,
            icon: FaStethoscope,
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
                className="w-full flex-1 bg-[#006D77] text-white flex flex-col items-center relative overflow-hidden pt-24" // Añadí pt-24 para más espacio superior
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

                {/* Texto descriptivo encima de las tarjetas, movido más abajo */}
                <motion.div className="text-center mb-12 z-10" variants={titleVariants}>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Bienvenido a Nuestra Plataforma de Salud
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-white mt-4">
                        Explora nuestros servicios de atención médica y bienestar personalizados para ti.
                    </p>
                </motion.div>

                {/* Cuadrícula de tarjetas */}
                <div className="container mx-auto px-6 z-10 flex-1 w-full flex items-center justify-center">
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 w-full h-full"
                        variants={containerVariants}
                    >
                        {services.map((service, index) => (
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

                                <motion.div className="relative">
                                    <motion.img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-48 object-cover"
                                        whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.div
                                        className="absolute top-4 left-4 bg-[#26A69A] text-white p-2 rounded-full"
                                        variants={iconVariants}
                                        whileHover="hover"
                                    >
                                        <service.icon className="w-6 h-6" />
                                    </motion.div>
                                </motion.div>
                                <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                                        <p className="text-white text-sm">{service.description}</p>
                                    </div>
                                    <motion.div
                                        className="h-1 bg-gradient-to-r from-[#004D61] to-[#26A69A]"
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

export default ServicesSection;