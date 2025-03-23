// src/Components/AdminComponents/ManageDoctorsComponents/CallToAction.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CallToAction = () => {
    return (
        <div className="mt-10 text-center">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Link
                    to="/admin/dashboard"
                    className="inline-block px-8 py-3 bg-teal-600 text-white rounded-full font-medium shadow-md transition-colors duration-300 hover:bg-teal-500 hover:shadow-lg"
                >
                    <motion.span
                        className="flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        Ir al Dashboard
                        <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </motion.span>
                </Link>
            </motion.div>
        </div>
    );
};

export default CallToAction;