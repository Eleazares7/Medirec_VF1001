// src/components/Profile/Profile.jsx
import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../Context/AuthContext.jsx';
import Navbar from '../../Components/HomeComponents/NavBar.jsx';
import Footer from '../../Components/HomeComponents/Footer.jsx';
import ProfileHeader from '../../Components/PatientProfileComponents/ProfileHeader.jsx';
import ProfilePhoto from '../../Components/PatientProfileComponents/ProfilePhoto.jsx';
import ProfileForm from '../../Components/PatientProfileComponents/ProfileForm.jsx';
import useProfile from '../../Components/PatientProfileComponents/useProfile.js';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon,
    DocumentTextIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const {
        patientData,
        editedData,
        photoUrl,
        newPhotoPreview,
        isVisible,
        isEditing,
        message,
        isLoadingCp,
        setIsEditing,
        handleInputChange,
        handlePhotoChange,
        handleCpChange,
        handleSubmit,
        cancelEdit,
        navigate,
    } = useProfile(user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    const handleOpenModal = () => {
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        cancelEdit();
    };

    const handleSaveChanges = async () => {
        await handleSubmit(new Event('submit'));
        setIsModalOpen(false);
    };

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

    // Animación para las tarjetas
    const cardVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: 'easeIn' } },
    };

    // Animación para los elementos dentro de las tarjetas
    const itemVariants = {
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

    if (!patientData) {
        return (
            <>
                <Navbar photoUrl={photoUrl} patientName={user?.nombre} />
                <div className="min-h-screen bg-teal-50 flex items-center justify-center">
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
                        <p className="text-teal-800 text-xl font-semibold">Cargando tu perfil...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar photoUrl={photoUrl} patientName={patientData.nombre} />
            <div className="min-h-screen bg-teal-50 py-12 px-6">
                <section
                    className={`max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8 transition-all duration-1000 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                        } relative pb-16`}
                >
                    <ProfileHeader
                        isEditing={isEditing}
                        setIsEditing={handleOpenModal}
                        cancelEdit={cancelEdit}
                    />

                    <ProfilePhoto
                        photoUrl={photoUrl}
                        newPhotoPreview={newPhotoPreview}
                        patientName={patientData.nombre}
                        isEditing={false}
                        handlePhotoChange={handlePhotoChange}
                    />

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`mb-6 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

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

                    {/* Vista estática de todos los datos del perfil con paginación */}
                    <div className="mt-8">
                        {/* Información Personal - Page 1 */}
                        {currentPage === 1 && (
                            <motion.div
                                key="page-1"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-teal-200 opacity-30 rounded-lg blur-md" />
                                <h2 className="text-2xl font-semibold text-teal-800 mb-4 flex items-center relative z-10">
                                    <UserIcon className="h-6 w-6 mr-2 text-teal-600" /> Información Personal
                                </h2>
                                <div className="space-y-4 relative z-10">
                                    <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <UserIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Nombre</h3>
                                            <p className="text-gray-800">{patientData.nombre || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <UserIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Apellido</h3>
                                            <p className="text-gray-800">{patientData.apellido || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <EnvelopeIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Email</h3>
                                            <p className="text-gray-800">{patientData.email || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Teléfono</h3>
                                            <p className="text-gray-800">{patientData.telefono || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Fecha de Nacimiento</h3>
                                            <p className="text-gray-800">
                                                {patientData.fechaNacimiento
                                                    ? new Date(patientData.fechaNacimiento).toLocaleDateString('es-MX', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })
                                                    : 'No disponible'}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Dirección - Page 2 */}
                        {currentPage === 2 && (
                            <motion.div
                                key="page-2"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-teal-200 opacity-30 rounded-lg blur-md" />
                                <h2 className="text-2xl font-semibold text-teal-800 mb-4 flex items-center relative z-10">
                                    <MapPinIcon className="h-6 w-6 mr-2 text-teal-600" /> Dirección
                                </h2>
                                <div className="space-y-4 relative z-10">
                                    <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Calle</h3>
                                            <p className="text-gray-800">{patientData.calle || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Número Exterior</h3>
                                            <p className="text-gray-800">{patientData.numeroExterior || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={2} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Entre Calle 1</h3>
                                            <p className="text-gray-800">{patientData.entreCalle1 || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={3} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Entre Calle 2</h3>
                                            <p className="text-gray-800">{patientData.entreCalle2 || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={4} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Código Postal</h3>
                                            <p className="text-gray-800">{patientData.codigoPostal || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={5} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Asentamiento</h3>
                                            <p className="text-gray-800">{patientData.asentamiento || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={6} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Municipio</h3>
                                            <p className="text-gray-800">{patientData.municipio || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={7} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Estado</h3>
                                            <p className="text-gray-800">{patientData.estado || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={8} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-teal-600 mr-3" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">País</h3>
                                            <p className="text-gray-800">{patientData.pais || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Historial Médico - Page 3 */}
                        {currentPage === 3 && (
                            <motion.div
                                key="page-3"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-teal-50 p-6 rounded-lg shadow-md border border-teal-200 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-teal-200 opacity-30 rounded-lg blur-md" />
                                <h2 className="text-2xl font-semibold text-teal-800 mb-4 flex items-center relative z-10">
                                    <DocumentTextIcon className="h-6 w-6 mr-2 text-teal-600" /> Historial Médico
                                </h2>
                                <div className="space-y-4 relative z-10">
                                    <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible" className="flex items-start">
                                        <DocumentTextIcon className="h-5 w-5 text-teal-600 mr-3 mt-1" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Alergias</h3>
                                            <p className="text-gray-800">{patientData.alergias || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                    <motion.div custom={1} variants={itemVariants} initial="hidden" animate="visible" className="flex items-start">
                                        <DocumentTextIcon className="h-5 w-5 text-teal-600 mr-3 mt-1" />
                                        <div>
                                            <h3 className="text-teal-700 font-semibold">Antecedentes Médicos</h3>
                                            <p className="text-gray-800">{patientData.antecedentes_medicos || 'No disponible'}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </div>

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
                    </div>

                    {/* Modal de Edición */}
                                    
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                            >
                                <h2 className="text-2xl font-semibold text-teal-800 mb-4">Editar Perfil</h2>
                                <ProfileForm
                                    editedData={editedData}
                                    isEditing={isEditing}
                                    handleInputChange={handleInputChange}
                                    handleCpChange={handleCpChange}
                                    handleSubmit={handleSubmit}
                                    isLoadingCp={isLoadingCp}
                                    onSaveChanges={handleSaveChanges}
                                    photoUrl={photoUrl} // Nueva prop
                                    newPhotoPreview={newPhotoPreview} // Nueva prop
                                    handlePhotoChange={handlePhotoChange} // Nueva prop
                                />
                                <div className="flex justify-end space-x-3 mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full font-semibold shadow-md hover:bg-gray-400 transition-all duration-300"
                                    >
                                        Cancelar
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="mt-8 text-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/patient/home')}
                            className="bg-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-teal-700 transition-all duration-300"
                        >
                            Volver al Inicio
                        </motion.button>
                    </motion.div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Profile;