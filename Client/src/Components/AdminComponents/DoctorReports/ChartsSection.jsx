// src/components/DoctorReports/ChartsSection.jsx
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const ChartsSection = ({ barChartData, pieChartData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Médicos por Especialidad</h3>
                <Bar
                    data={barChartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Médicos por Especialidad' },
                        },
                    }}
                />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Distribución de Horarios</h3>
                <Pie
                    data={pieChartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Distribución de Horarios por Estado' },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default ChartsSection;