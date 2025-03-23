// src/Components/AdminComponents/ManageDoctorsComponents/AdminInfoCard.jsx

import React from 'react';
import { motion } from 'framer-motion';

const AdminInfoCard = ({ adminData, formatDate }) => {
    return (
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
    );
};

export default AdminInfoCard;