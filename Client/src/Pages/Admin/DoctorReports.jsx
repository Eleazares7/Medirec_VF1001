// src/components/DoctorReports/DoctorReports.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import FiltersSection from '../../Components/AdminComponents/DoctorReports/FiltersSection.jsx';
import ActionButtons from '../../Components/AdminComponents/DoctorReports/ActionButtons.jsx';
import ChartsSection from '../../Components/AdminComponents/DoctorReports/ChartsSection.jsx';
import DoctorsTable from '../../Components/AdminComponents/DoctorReports/DoctorsTable.jsx';
import useDoctorReports from '../../Components/AdminComponents/DoctorReports/useDoctorReports.js';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin.jsx';

// Registrar los elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DoctorReports = ({ onBack }) => {
    const {
        filteredDoctors,
        filters,
        especialidades,
        showCharts,
        barChartData,
        pieChartData,
        csvData,
        handleFilterChange,
        handleDateChange,
        generatePDF,
        setShowCharts,
    } = useDoctorReports();

    return (
        <>
        <NavbarAdmin/>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl w-full mx-auto bg-white rounded-xl shadow-xl p-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-teal-900">Reportes de Médicos</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBack}
                        className="px-6 py-2 bg-teal-600 text-white rounded-full font-medium shadow-md hover:bg-teal-700 transition-all duration-300"
                    >
                        Volver
                    </motion.button>
                </div>

                {/* Filtros */}
                <FiltersSection
                    filters={filters}
                    especialidades={especialidades}
                    handleFilterChange={handleFilterChange}
                    handleDateChange={handleDateChange}
                />

                {/* Botones de acción */}
                <ActionButtons
                    generatePDF={generatePDF}
                    csvData={csvData}
                    showCharts={showCharts}
                    setShowCharts={setShowCharts}
                />

                {/* Gráficas */}
                {showCharts && <ChartsSection barChartData={barChartData} pieChartData={pieChartData} />}

                {/* Tabla de médicos */}
                <DoctorsTable filteredDoctors={filteredDoctors} />
            </motion.div>
        </>
    );
};

export default DoctorReports;