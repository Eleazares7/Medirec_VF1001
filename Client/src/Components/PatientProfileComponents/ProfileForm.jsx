// src/components/Profile/ProfileForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, MapPinIcon, DocumentTextIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, CameraIcon } from '@heroicons/react/24/outline';

const ProfileForm = ({ editedData, isEditing, handleInputChange, handleCpChange, handleSubmit, isLoadingCp, onSaveChanges, photoUrl, newPhotoPreview, handlePhotoChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    // Estilo mejorado para los campos de entrada
    const inputClass = (isEditing, isEditable = true) =>
        `w-full px-4 py-3 rounded-lg border focus:outline-none transition-all duration-300 ${isEditing && isEditable
            ? 'border-teal-400 bg-white shadow-md focus:ring-2 focus:ring-teal-300 hover:border-teal-500'
            : 'border-teal-200 bg-teal-50 text-teal-800'
        }`;

    const textareaClass = (isEditing) =>
        `w-full px-4 py-3 rounded-lg border focus:outline-none resize-none h-24 transition-all duration-300 ${isEditing
            ? 'border-teal-400 bg-white shadow-md focus:ring-2 focus:ring-teal-300 hover:border-teal-500'
            : 'border-teal-200 bg-teal-50 text-teal-800'
        }`;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Animación para las secciones
    const sectionVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: 'easeIn' } },
    };

    // Animación para los campos dentro de las secciones
    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, delay: i * 0.1 },
        }),
    };

    // Animación para los botones
    const buttonVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.5, type: 'spring', stiffness: 120, damping: 10 },
        },
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Indicador de Paginación */}
            <div className="flex justify-center mb-6">
                {[...Array(totalPages)].map((_, index) => (
                    <motion.div
                        key={index}
                        className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${currentPage === index + 1 ? 'bg-teal-600' : 'bg-teal-200'
                            }`}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(index + 1)}
                    />
                ))}
            </div>

            {/* Información Personal - Page 1 */}
            {currentPage === 1 && (
                <motion.div
                    key="page-1"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-teal-200 opacity-30 rounded-lg blur-md" />
                    <h2 className="text-2xl font-semibold text-teal-800 mb-6 flex items-center relative z-10">
                        <UserIcon className="h-6 w-6 mr-2 text-teal-600" /> Información Personal
                    </h2>
                    <div className="relative z-10">
                        {/* Sección de la Foto */}
                        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-teal-200">
                                    {newPhotoPreview ? (
                                        <img
                                            src={newPhotoPreview}
                                            alt="Previsualización de la foto"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-teal-100 flex items-center justify-center">
                                            <UserIcon className="h-16 w-16 text-teal-600" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-300">
                                        <CameraIcon className="h-6 w-6" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </motion.div>

                        {/* Campos de Información Personal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                                <label className="block text-teal-700 font-semibold mb-2 flex items-center">
                                    <UserIcon className="h-5 w-5 mr-2 text-teal-600" /> Nombre
                                </label>
                                <input
                                    type="text"
                                    value={editedData.nombre || ''}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                    readOnly={!isEditing}
                                    className={inputClass(isEditing)}
                                />
                            </motion.div>
                            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                                <label className="block text-teal-700 font-semibold mb-2 flex items-center">
                                    <UserIcon className="h-5 w-5 mr-2 text-teal-600" /> Apellido
                                </label>
                                <input
                                    type="text"
                                    value={editedData.apellido || ''}
                                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                                    readOnly={!isEditing}
                                    className={inputClass(isEditing)}
                                />
                            </motion.div>
                            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                                <label className="block text-teal-700 font-semibold mb-2 flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 mr-2 text-teal-600" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={editedData.email || ''}
                                    readOnly
                                    className="w-full px-4 py-3 bg-teal-100 text-teal-800 rounded-lg border border-teal-200 focus:outline-none"
                                />
                            </motion.div>
                            <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                                <label className="block text-teal-700 font-semibold mb-2 flex items-center">
                                    <PhoneIcon className="h-5 w-5 mr-2 text-teal-600" /> Teléfono
                                </label>
                                <input
                                    type="text"
                                    value={editedData.telefono || ''}
                                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                                    readOnly={!isEditing}
                                    className={inputClass(isEditing)}
                                />
                            </motion.div>
                            <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                                <label className="block text-teal-700 font-semibold mb-2 flex items-center">
                                    <CalendarIcon className="h-5 w-5 mr-2 text-teal-600" /> Fecha de Nacimiento
                                </label>
                                {isEditing ? (
                                    <DatePicker
                                        selected={editedData.fechaNacimiento ? new Date(editedData.fechaNacimiento) : null}
                                        onChange={(date) => handleInputChange('fechaNacimiento', date.toISOString())}
                                        dateFormat="dd/MM/yyyy"
                                        className={inputClass(isEditing)}
                                        placeholderText="Selecciona una fecha"
                                        wrapperClassName="w-full"
                                        popperClassName="z-50"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={
                                            editedData.fechaNacimiento
                                                ? new Date(editedData.fechaNacimiento).toLocaleDateString()
                                                : 'No disponible'
                                        }
                                        readOnly
                                        className={inputClass(isEditing)}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Dirección - Page 2 */}
            {currentPage === 2 && (
                <motion.div
                    key="page-2"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-teal-200 opacity-30 rounded-lg blur-md" />
                    <h2 className="text-2xl font-semibold text-teal-800 mb-6 flex items-center relative z-10">
                        <MapPinIcon className="h-6 w-6 mr-2 text-teal-600" /> Dirección
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Calle</label>
                            <input
                                type="text"
                                value={editedData.calle || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Número Exterior</label>
                            <input
                                type="text"
                                value={editedData.numeroExterior || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Entre Calle 1</label>
                            <input
                                type="text"
                                value={editedData.entreCalle1 || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Entre Calle 2</label>
                            <input
                                type="text"
                                value={editedData.entreCalle2 || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="relative">
                            <label className="block text-teal-700 font-semibold mb-2">Código Postal</label>
                            <input
                                type="text"
                                value={editedData.codigoPostal || ''}
                                onChange={(e) => {
                                    handleInputChange('codigoPostal', e.target.value);
                                    handleCpChange(e.target.value);
                                }}
                                readOnly={!isEditing}
                                className={inputClass(isEditing)}
                            />
                            {isLoadingCp && (
                                <svg
                                    className="animate-spin h-5 w-5 text-teal-600 absolute right-3 top-10"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>
                            )}
                        </motion.div>
                        <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Asentamiento</label>
                            <input
                                type="text"
                                value={editedData.asentamiento || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                        <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Municipio</label>
                            <input
                                type="text"
                                value={editedData.municipio || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                        <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Estado</label>
                            <input
                                type="text"
                                value={editedData.estado || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                        <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">País</label>
                            <input
                                type="text"
                                value={editedData.pais || ''}
                                readOnly
                                className={inputClass(isEditing, false)}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Historial Médico - Page 3 */}
            {currentPage === 3 && (
                <motion.div
                    key="page-3"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-teal-200 opacity-30 rounded-lg blur-md" />
                    <h2 className="text-2xl font-semibold text-teal-800 mb-6 flex items-center relative z-10">
                        <DocumentTextIcon className="h-6 w-6 mr-2 text-teal-600" /> Historial Médico
                    </h2>
                    <div className="grid grid-cols-1 gap-6 relative z-10">
                        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Alergias</label>
                            <textarea
                                value={editedData.alergias || ''}
                                onChange={(e) => handleInputChange('alergias', e.target.value)}
                                readOnly={!isEditing}
                                className={textareaClass(isEditing)}
                            />
                        </motion.div>
                        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                            <label className="block text-teal-700 font-semibold mb-2">Antecedentes Médicos</label>
                            <textarea
                                value={editedData.antecedentes_medicos || ''}
                                onChange={(e) => handleInputChange('antecedentes_medicos', e.target.value)}
                                readOnly={!isEditing}
                                className={textareaClass(isEditing)}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Controles de Paginación */}
            <div className="flex justify-between mt-6">
                <motion.div
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    className="group"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`flex items-center px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${currentPage === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Anterior
                    </motion.button>
                    <div className="absolute bottom-12 left-0 bg-teal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Página Anterior
                    </div>
                </motion.div>

                {currentPage < totalPages ? (
                    <motion.div
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        className="group"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${currentPage === totalPages
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                                }`}
                        >
                            Siguiente <ArrowRightIcon className="h-5 w-5 ml-2" />
                        </motion.button>
                        <div className="absolute bottom-12 right-0 bg-teal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Página Siguiente
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
                            onClick={onSaveChanges}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-full font-semibold shadow-md hover:bg-green-700 transition-all duration-300"
                        >
                            <CheckIcon className="h-5 w-5 mr-2" /> Guardar Cambios
                        </motion.button>
                        <div className="absolute bottom-12 right-0 bg-teal-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Guardar y Cerrar
                        </div>
                    </motion.div>
                )}
            </div>
        </form>
    );
};

export default ProfileForm;