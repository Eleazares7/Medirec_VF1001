import React from 'react';
import { motion } from 'framer-motion';
import DoctorOptionCard from './DoctorOptionCard';
import { doctorOptions } from './constants';

const DoctorOptions = ({ onShowList }) => (
    <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-8"
    >
        <div className="text-center mb-8">
            <motion.h1
                whileHover={{ scale: 1.05 }}
                className="text-4xl font-bold text-teal-800 mb-4"
            >
                Administrar Doctores
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-gray-600 text-lg"
            >
                Selecciona una opción para gestionar los doctores
            </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctorOptions.map((option, index) => (
                <DoctorOptionCard
                    key={option.name}
                    option={option}
                    index={index}
                    onShowList={option.name === 'Lista de Doctores' ? onShowList : null}
                />
            ))}
        </div>
    </motion.div>
);

export default DoctorOptions;