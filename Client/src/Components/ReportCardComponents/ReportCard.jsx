// ReportCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ReportCard = ({ report, index, cardVariants, iconVariants }) => {
    return (
        <motion.div
            className="relative bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-[#26A69A]/20 flex flex-col h-full"
            variants={cardVariants}
            whileHover="hover"
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#004D61] via-[#006D77] to-[#26A69A]"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%', zIndex: 0 }}
            />
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(38,166,154,0.3)_70%)]" />
            </motion.div>

            {/* SVGs decorativos */}
            <motion.svg
                className="absolute top-4 left-4 w-12 h-12 text-teal-600 opacity-20"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
                <path stroke="currentColor" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
            </motion.svg>
            <motion.svg
                className="absolute bottom-4 right-4 w-12 h-12 text-teal-500 opacity-20"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ y: [-10, 0, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
                <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </motion.svg>

            <div className="relative p-6 flex-1 flex flex-col justify-between">
                <div>
                    <motion.div
                        className="mb-4 bg-[#26A69A] text-white p-3 rounded-full inline-flex items-center justify-center"
                        variants={iconVariants}
                        whileHover="hover"
                    >
                        <report.icon className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">{report.title}</h3>
                    <p className="text-white text-sm mb-4">{report.description}</p>
                    <p className="text-white text-sm font-medium mt-2">
                        Precio: <span className="font-bold">{report.price}</span>
                    </p>
                </div>
                <div className="mt-4">
                    <button className="bg-[#26A69A] text-white px-4 py-2 rounded-full hover:bg-[#1f8d82] transition-colors">
                        Obtener Ahora
                    </button>
                </div>
                <motion.div
                    className="h-1 bg-gradient-to-r from-[#004D61] to-[#26A69A] mt-4"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                />
            </div>
        </motion.div>
    );
};

export default ReportCard;