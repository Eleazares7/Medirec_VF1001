import React from "react";
import { motion } from "framer-motion";

const NavigationButtons = ({ step, prevStep, nextStep, buttonVariants }) => {
  return (
    <div className="flex justify-between mt-6">
      {step > 1 && (
        <motion.button
          type="button"
          onClick={prevStep}
          className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Anterior
        </motion.button>
      )}
      {step < 4 && (
        <motion.button
          type="button"
          onClick={nextStep}
          className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg ml-auto"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Siguiente
        </motion.button>
      )}
      {step === 4 && (
        <motion.button
          type="submit"
          className="bg-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg flex items-center ml-auto"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          animate="pulse"
        >
          Registrar Paciente
          <motion.svg
            className="w-6 h-6 ml-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </motion.svg>
        </motion.button>
      )}
    </div>
  );
};

export default NavigationButtons;