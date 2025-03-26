// src/components/DoctorReports/ActionButtons.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CSVLink } from 'react-csv';
import { FaFilePdf, FaFileCsv, FaChartBar, FaChartPie } from 'react-icons/fa';

const ActionButtons = ({ generatePDF, csvData, showCharts, setShowCharts }) => {
    return (
        <div className="flex space-x-4 mb-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generatePDF}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-teal-700"
            >
                <FaFilePdf className="mr-2" /> Generar PDF
            </motion.button>
            <CSVLink
                data={csvData}
                filename="reporte_medicos.csv"
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-teal-700"
            >
                <FaFileCsv className="mr-2" /> Exportar CSV
            </CSVLink>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCharts(!showCharts)}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-teal-700"
            >
                {showCharts ? (
                    <>
                        <FaChartBar className="mr-2" /> Ocultar Gráficas
                    </>
                ) : (
                    <>
                        <FaChartPie className="mr-2" /> Mostrar Gráficas
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default ActionButtons;