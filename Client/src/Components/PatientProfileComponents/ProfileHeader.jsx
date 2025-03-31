// src/components/Profile/ProfileHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

const ProfileHeader = ({ isEditing, setIsEditing, cancelEdit }) => {
    // Animación para el título
    const titleVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
                type: 'spring',
                stiffness: 100,
                damping: 10,
            },
        },
    };

    // Animación para el ícono del título
    const iconVariants = {
        initial: { rotate: 0 },
        animate: {
            rotate: [0, 10, -10, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    // Animación para el botón de edición
    const buttonVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: 0.4,
                type: 'spring',
                stiffness: 120,
                damping: 10,
            },
        },
    };

    return (
        <div className="relative mb-10">
            {/* Fondo con gradiente detrás del título */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-200 to-teal-400 opacity-30 rounded-lg blur-md"
                style={{ height: '60px', top: '-10px' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
            />

            {/* Contenedor del título */}
            <motion.div
                className="relative flex justify-center items-center bg-white rounded-lg shadow-md py-4 px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div variants={iconVariants} initial="initial" animate="animate">
                    <UserIcon className="h-8 w-8 text-teal-600 mr-3" />
                </motion.div>
                <motion.h1
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl font-bold text-teal-800 text-center"
                >
                    Tu Perfil
                </motion.h1>
            </motion.div>

            {/* Botón de Edición o Cancelar */}
            <div className="absolute bottom-0 right-0 transform translate-y-4">
                {!isEditing ? (
                    <motion.div
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        className="group"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsEditing(true)}
                            className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-all duration-300 flex items-center justify-center"
                        >
                            <PencilIcon className="h-6 w-6" />
                        </motion.button>
                        {/* Tooltip */}
                        <div className="absolute bottom-14 right-0 bg-teal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Editar Perfil
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        className="group"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full font-semibold shadow-md hover:bg-red-700 transition-all duration-300"
                        >
                            <XMarkIcon className="h-5 w-5 mr-2" /> Cancelar Edición
                        </motion.button>
                        {/* Tooltip */}
                        <div className="absolute bottom-12 right-0 bg-teal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Cancelar Cambios
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;