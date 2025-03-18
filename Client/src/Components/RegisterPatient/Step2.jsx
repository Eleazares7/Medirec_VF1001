import React from "react";
import { motion } from "framer-motion";

const Step2 = ({
    formData,
    handleChange,
    childVariants,
    colonias,
    apiError
}) => {
    return (
        <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={childVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <motion.div variants={childVariants} className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" htmlFor="calle">
                    Calle
                </label>
                <input
                    type="text"
                    name="calle"
                    id="calle"
                    value={formData.calle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </motion.div>
            <motion.div variants={childVariants}>
                <label className="block text-sm font-medium mb-2" htmlFor="numeroExterior">
                    No. Exterior
                </label>
                <input
                    type="text"
                    name="numeroExterior"
                    id="numeroExterior"
                    value={formData.numeroExterior}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </motion.div>
            <motion.div variants={childVariants}>
                <label className="block text-sm font-medium mb-2" htmlFor="entreCalle1">
                    Entre Calle 1
                </label>
                <input
                    type="text"
                    name="entreCalle1"
                    id="entreCalle1"
                    value={formData.entreCalle1}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </motion.div>
            <motion.div variants={childVariants}>
                <label className="block text-sm font-medium mb-2" htmlFor="entreCalle2">
                    Entre Calle 2
                </label>
                <input
                    type="text"
                    name="entreCalle2"
                    id="entreCalle2"
                    value={formData.entreCalle2}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </motion.div>
            <motion.div variants={childVariants} className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" htmlFor="codigoPostal">
                    Código Postal
                </label>
                <input
                    type="text"
                    name="codigoPostal"
                    id="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    maxLength="5"
                    required
                />
                {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
            </motion.div>
            <motion.div variants={childVariants} className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" htmlFor="asentamiento">
                    Asentamiento
                </label>
                {colonias.length > 0 ? (
                    <select
                        name="asentamiento"
                        id="asentamiento"
                        value={formData.asentamiento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        {colonias.map((colonia, index) => (
                            <option key={index} value={colonia}>
                                {colonia}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        name="asentamiento"
                        id="asentamiento"
                        value={formData.asentamiento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        readOnly
                    />
                )}
            </motion.div>
            <motion.div variants={childVariants}>
                <label className="block text-sm font-medium mb-2" htmlFor="municipio">
                    Municipio
                </label>
                <input
                    type="text"
                    name="municipio"
                    id="municipio"
                    value={formData.municipio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    readOnly
                />
            </motion.div>
            <motion.div variants={childVariants}>
                <label className="block text-sm font-medium mb-2" htmlFor="estado">
                    Estado
                </label>
                <input
                    type="text"
                    name="estado"
                    id="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    readOnly
                />
            </motion.div>
            <motion.div variants={childVariants} className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" htmlFor="pais">
                    País
                </label>
                <input
                    type="text"
                    name="pais"
                    id="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    readOnly
                />
            </motion.div>
        </motion.div>
    );
};

export default Step2;