// src/components/DoctorReports/DoctorsTable.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DoctorsTable = ({ filteredDoctors }) => {
    return (
        <div className="bg-teal-50 p-6 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">Lista de Médicos</h3>
            {filteredDoctors.length === 0 ? (
                <p className="text-gray-600 text-center text-lg">No hay médicos que coincidan con los filtros.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-teal-900 font-semibold">
                                <th className="p-4">Foto</th>
                                <th className="p-4">Nombre</th>
                                <th className="p-4">Apellido</th>
                                <th className="p-4">Especialidad</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Número de Licencia</th>
                                <th className="p-4">Horarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.map((doctor, index) => (
                                <motion.tr
                                    key={doctor.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <td className="p-4 rounded-l-lg">
                                        {doctor.foto ? (
                                            <img
                                                src={doctor.foto}
                                                alt={`Foto de ${doctor.nombre}`}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                                            />
                                        ) : (
                                            <span className="text-gray-500 text-sm">Sin foto</span>
                                        )}
                                    </td>
                                    <td className="p-4">{doctor.nombre}</td>
                                    <td className="p-4">{doctor.apellido}</td>
                                    <td className="p-4">{doctor.especialidad}</td>
                                    <td className="p-4">{doctor.email}</td>
                                    <td className="p-4">{doctor.numero_licencia}</td>
                                    <td className="p-4 rounded-r-lg">
                                        {doctor.horarios && doctor.horarios.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm">
                                                {doctor.horarios.map((horario, i) => (
                                                    <li key={i}>
                                                        {horario.dia_semana || horario.fecha} de{' '}
                                                        {horario.hora_inicio} a {horario.hora_fin} (
                                                        {horario.estado})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Sin horarios</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DoctorsTable;