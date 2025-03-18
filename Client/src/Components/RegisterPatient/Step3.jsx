import React from "react";
import { motion } from "framer-motion";

const Step3 = ({ formData, handleChange, childVariants }) => {
  return (
    <motion.div
      key="step3"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={childVariants}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <motion.div variants={childVariants} className="md:col-span-2">
        <label className="block text-sm font-medium mb-2" htmlFor="alergias">
          Alergias
        </label>
        <textarea
          name="alergias"
          id="alergias"
          value={formData.alergias}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows="3"
        />
      </motion.div>
      <motion.div variants={childVariants} className="md:col-span-2">
        <label
          className="block text-sm font-medium mb-2"
          htmlFor="antecedentes_medicos"
        >
          Antecedentes Médicos
        </label>
        <textarea
          name="antecedentes_medicos"
          id="antecedentes_medicos"
          value={formData.antecedentes_medicos}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows="3"
        />
      </motion.div>
    </motion.div>
  );
};

export default Step3;