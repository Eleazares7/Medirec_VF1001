import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DoctorOptionCard = ({ option, index, onShowList }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        whileHover={{ y: -8, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        className="bg-teal-50 p-6 rounded-md shadow-md hover:bg-teal-100"
    >
        {option.url ? (
            <Link to={option.url} className="flex flex-col items-center text-center">
                <motion.svg
                    whileHover={{ rotate: 12 }}
                    className="w-12 h-12 text-teal-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon} />
                </motion.svg>
                <h3 className="text-lg font-semibold text-teal-800 hover:text-teal-900">
                    {option.name}
                </h3>
                <p className="text-gray-600 mt-2">{option.description}</p>
            </Link>
        ) : (
            <button
                onClick={onShowList}
                className="flex flex-col items-center text-center w-full"
            >
                <motion.svg
                    whileHover={{ rotate: 12 }}
                    className="w-12 h-12 text-teal-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon} />
                </motion.svg>
                <h3 className="text-lg font-semibold text-teal-800 hover:text-teal-900">
                    {option.name}
                </h3>
                <p className="text-gray-600 mt-2">{option.description}</p>
            </button>
        )}
    </motion.div>
);

export default DoctorOptionCard;