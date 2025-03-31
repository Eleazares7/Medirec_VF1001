// src/components/Profile/ProfilePhoto.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CameraIcon } from '@heroicons/react/24/outline';

const ProfilePhoto = ({ photoUrl, newPhotoPreview, patientName, isEditing, handlePhotoChange }) => {
    // Animación de entrada con rebote
    const photoVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
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

    // Animación para el ícono de la cámara
    const cameraVariants = {
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

    // Animación para el borde al pasar el mouse
    const borderVariants = {
        initial: { scale: 1, opacity: 0 },
        hover: { scale: 1.1, opacity: 1, transition: { duration: 0.3 } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={photoVariants}
            className="flex justify-center mb-10 relative"
        >
            <div className="relative">
                {/* Fondo con gradiente detrás de la foto */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-200 to-teal-400 opacity-50 blur-md"
                    style={{ width: '160px', height: '160px' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />

                {/* Borde animado al pasar el mouse */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-teal-400"
                    style={{ width: '160px', height: '160px' }}
                    variants={borderVariants}
                    initial="initial"
                    whileHover="hover"
                />

                {/* Foto o placeholder */}
                <motion.div
                    className="relative w-40 h-40 rounded-full shadow-xl transform transition-transform duration-300 hover:-translate-y-2"
                    whileHover={{ scale: 1.05 }}
                >
                    {newPhotoPreview || photoUrl ? (
                        <img
                            src={newPhotoPreview || photoUrl}
                            alt="Foto del paciente"
                            className="w-40 h-40 rounded-full object-cover border-4 border-teal-300"
                        />
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-teal-200 flex items-center justify-center border-4 border-teal-300">
                            <span className="text-5xl font-bold text-teal-800">{patientName?.[0] || 'U'}</span>
                        </div>
                    )}
                </motion.div>

                {/* Botón de edición con tooltip */}
                {isEditing && (
                    <motion.div
                        className="absolute bottom-2 right-2 group"
                        variants={cameraVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <label
                            htmlFor="photo-upload"
                            className="bg-teal-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-teal-700 transition-all duration-300"
                        >
                            <CameraIcon className="h-6 w-6" />
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                        {/* Tooltip */}
                        <div className="absolute bottom-12 right-0 bg-teal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Cambiar foto
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfilePhoto;