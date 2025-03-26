// src/components/DoctorReports/FiltersSection.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch } from 'react-icons/fa';

const FiltersSection = ({ filters, especialidades, handleFilterChange, handleDateChange }) => {
    return (
        <div className="bg-teal-50 p-6 rounded-lg shadow-inner mb-6">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro por nombre */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Buscar por Nombre</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="nombre"
                            value={filters.nombre}
                            onChange={handleFilterChange}
                            placeholder="Nombre del doctor..."
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Filtro por especialidad */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Especialidad</label>
                    <select
                        name="especialidad"
                        value={filters.especialidad}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    >
                        <option value="">Todas</option>
                        {especialidades.map((especialidad) => (
                            <option key={especialidad} value={especialidad}>
                                {especialidad}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por estado de horarios */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Estado de Horarios</label>
                    <select
                        name="estadoHorario"
                        value={filters.estadoHorario}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                    >
                        <option value="">Todos</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Reservado">Reservado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>

                {/* Filtro por rango de fechas */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Fecha Inicio</label>
                    <DatePicker
                        selected={filters.fechaInicio}
                        onChange={(date) => handleDateChange(date, 'fechaInicio')}
                        dateFormat="yyyy-MM-dd"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                        placeholderText="Selecciona una fecha"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Fecha Fin</label>
                    <DatePicker
                        selected={filters.fechaFin}
                        onChange={(date) => handleDateChange(date, 'fechaFin')}
                        dateFormat="yyyy-MM-dd"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                        placeholderText="Selecciona una fecha"
                    />
                </div>
            </div>
        </div>
    );
};

export default FiltersSection;