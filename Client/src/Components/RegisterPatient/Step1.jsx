import React from "react";
import { motion } from "framer-motion";

const Step1 = ({ formData, handleChange, childVariants }) => {
    return (
        <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={childVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <motion.div variants={childVariants} className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" htmlFor="nombre">
                    Nombre
                </label>
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                />
            </motion.div>
            <motion.div variants={childVariants}>
                <label className="block text-sm font-medium mb-2" htmlFor="telefono">
                    Teléfono
                </label>
                <input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </motion.div>
            <motion.div variants={childVariants}>
                <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="fechaNacimiento"
                >
                    Fecha de Nacimiento
                </label>
                <input
                    type="date"
                    name="fechaNacimiento"
                    id="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                />
            </motion.div>
        </motion.div>
    );
};

export default Step1;