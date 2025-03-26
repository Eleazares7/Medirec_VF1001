import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Configurar react-modal para accesibilidad
Modal.setAppElement('#root');

const DoctorList = ({ doctors, onBack, fetchDoctors }) => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para abrir el modal con los datos del doctor
    const handleEdit = (doctor) => {
        setSelectedDoctor({ ...doctor, horarios: doctor.horarios || [] });
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
    };

    // Manejar cambios en los campos del doctor
    const handleDoctorChange = (e) => {
        const { name, value } = e.target;
        setSelectedDoctor((prev) => ({ ...prev, [name]: value }));
    };

    // Manejar cambios en los horarios
    const handleHorarioChange = (index, field, value) => {
        const updatedHorarios = [...selectedDoctor.horarios];
        updatedHorarios[index] = { ...updatedHorarios[index], [field]: value };
        setSelectedDoctor((prev) => ({ ...prev, horarios: updatedHorarios }));
    };

    // Agregar un nuevo horario
    const addHorario = () => {
        setSelectedDoctor((prev) => ({
            ...prev,
            horarios: [
                ...prev.horarios,
                {
                    dia_semana: '',
                    fecha: null,
                    hora_inicio: '',
                    hora_fin: '',
                    estado: 'Disponible',
                },
            ],
        }));
    };

    // Eliminar un horario
    const removeHorario = (index) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este horario será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#0d9488',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedHorarios = selectedDoctor.horarios.filter((_, i) => i !== index);
                setSelectedDoctor((prev) => ({ ...prev, horarios: updatedHorarios }));
            }
        });
    };

    // Función para actualizar un doctor
    const handleUpdateDoctor = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No se encontró el token de autenticación.");

            // Validar horarios en el frontend
            if (selectedDoctor.horarios) {
                for (const horario of selectedDoctor.horarios) {
                    if (!horario.dia_semana && !horario.fecha) {
                        throw new Error('Debe especificar un día de la semana o una fecha para cada horario.');
                    }
                    if (!horario.hora_inicio || !horario.hora_fin) {
                        throw new Error('La hora de inicio y la hora de fin son obligatorias para cada horario.');
                    }
                    const inicio = new Date(`1970-01-01T${horario.hora_inicio}:00`);
                    const fin = new Date(`1970-01-01T${horario.hora_fin}:00`);
                    if (inicio >= fin) {
                        throw new Error('La hora de inicio debe ser anterior a la hora de fin en todos los horarios.');
                    }
                }
            }

            const response = await fetch('http://localhost:5000/admin/users/updateDoctor', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: selectedDoctor.id,
                    nombre: selectedDoctor.nombre,
                    apellido: selectedDoctor.apellido,
                    especialidad: selectedDoctor.especialidad,
                    email: selectedDoctor.email,
                    numero_licencia: selectedDoctor.numero_licencia,
                    horarios: selectedDoctor.horarios.map(horario => ({
                        ...horario,
                        fecha: horario.fecha ? new Date(horario.fecha).toISOString().split('T')[0] : null,
                    })),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar el doctor');
            }

            if (!data.success) {
                throw new Error(data.message || 'Error al actualizar el doctor');
            }

            handleCloseModal();
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: data.message,
                confirmButtonColor: '#0d9488',
            });
            fetchDoctors();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonColor: '#0d9488',
            });
        }
    };

    // Función para eliminar un doctor
    const handleDelete = (doctor) => {
        Swal.fire({
            title: '¿Estás seguro?',
            html: `¿Deseas eliminar al doctor <strong>${doctor.nombre} ${doctor.apellido}</strong>? <br> 
                   Especialidad: ${doctor.especialidad} <br> 
                   Email: ${doctor.email} <br> 
                   Número de Licencia: ${doctor.numero_licencia}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#0d9488',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("No se encontró el token de autenticación.");

                    const response = await fetch('http://localhost:5000/admin/users/deleteDoctor', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ id: doctor.id }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Error al eliminar el doctor');
                    }

                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El doctor ha sido eliminado correctamente',
                        confirmButtonColor: '#0d9488',
                    });
                    fetchDoctors();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message,
                        confirmButtonColor: '#0d9488',
                    });
                }
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl w-full mx-auto bg-white rounded-xl shadow-xl p-8"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-teal-900">Lista de Doctores</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="px-6 py-2 bg-teal-600 text-white rounded-full font-medium shadow-md hover:bg-teal-700 transition-all duration-300"
                >
                    Volver a Opciones
                </motion.button>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-inner">
                {doctors.length === 0 ? (
                    <p className="text-gray-600 text-center text-lg">No hay doctores registrados.</p>
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
                                    <th className="p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor, index) => (
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
                                        <td className="p-4">
                                            {doctor.horarios && doctor.horarios.length > 0 ? (
                                                <>
                                                    <FaCalendarAlt
                                                        className="text-teal-600 cursor-pointer"
                                                        size={20}
                                                        data-tooltip-id={`horarios-${doctor.id}`}
                                                    />
                                                    <Tooltip
                                                        id={`horarios-${doctor.id}`}
                                                        place="top"
                                                        effect="solid"
                                                        className="bg-teal-800 text-white rounded-lg p-3 max-w-xs"
                                                    >
                                                        <ul className="list-disc list-inside">
                                                            {doctor.horarios.map((horario, i) => (
                                                                <li key={i} className="text-sm">
                                                                    <span className="font-semibold">
                                                                        {horario.dia_semana || horario.fecha}
                                                                    </span>{' '}
                                                                    de {horario.hora_inicio} a {horario.hora_fin} (
                                                                    {horario.estado})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <span className="text-gray-500 text-sm">Sin horarios</span>
                                            )}
                                        </td>
                                        <td className="p-4 rounded-r-lg flex space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEdit(doctor)}
                                                className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300"
                                                title="Editar"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDelete(doctor)}
                                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
                                                title="Eliminar"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a2 2 0 00-2 2h8a2 2 0 00-2-2m-4 0h4"
                                                    />
                                                </svg>
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal para editar doctor */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
                overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
                closeTimeoutMS={300}
            >
                <h3 className="text-2xl font-bold text-teal-900 mb-6">Editar Doctor</h3>
                <div className="flex justify-center mb-6">
                    {selectedDoctor?.foto ? (
                        <img
                            src={selectedDoctor.foto}
                            alt={`Foto de ${selectedDoctor.nombre}`}
                            className="w-24 h-24 rounded-full object-cover border-4 border-teal-500 shadow-md"
                        />
                    ) : (
                        <span className="text-gray-500 text-lg">Sin foto</span>
                    )}
                </div>
                <form onSubmit={handleUpdateDoctor}>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={selectedDoctor?.nombre || ''}
                            onChange={handleDoctorChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            value={selectedDoctor?.apellido || ''}
                            onChange={handleDoctorChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Especialidad</label>
                        <input
                            type="text"
                            name="especialidad"
                            value={selectedDoctor?.especialidad || ''}
                            onChange={handleDoctorChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={selectedDoctor?.email || ''}
                            onChange={handleDoctorChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Número de Licencia</label>
                        <input
                            type="text"
                            name="numero_licencia"
                            value={selectedDoctor?.numero_licencia || ''}
                            onChange={handleDoctorChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                            required
                        />
                    </div>

                    {/* Horarios */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-3">Horarios</label>
                        {selectedDoctor?.horarios.map((horario, index) => (
                            <div
                                key={index}
                                className="border border-teal-200 rounded-lg p-5 mb-4 relative bg-teal-50 shadow-sm"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Día de la semana */}
                                    <div>
                                        <label
                                            htmlFor={`dia_semana_${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Día de la Semana
                                        </label>
                                        <select
                                            id={`dia_semana_${index}`}
                                            name="dia_semana"
                                            value={horario.dia_semana || ''}
                                            onChange={(e) => handleHorarioChange(index, 'dia_semana', e.target.value)}
                                            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                                        >
                                            <option value="">Selecciona un día</option>
                                            <option value="Lunes">Lunes</option>
                                            <option value="Martes">Martes</option>
                                            <option value="Miércoles">Miércoles</option>
                                            <option value="Jueves">Jueves</option>
                                            <option value="Viernes">Viernes</option>
                                            <option value="Sábado">Sábado</option>
                                            <option value="Domingo">Domingo</option>
                                        </select>
                                    </div>

                                    {/* Fecha (opcional) */}
                                    <div>
                                        <label
                                            htmlFor={`fecha_${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Fecha (Opcional)
                                        </label>
                                        <DatePicker
                                            selected={horario.fecha ? new Date(horario.fecha) : null}
                                            onChange={(date) => handleHorarioChange(index, 'fecha', date)}
                                            dateFormat="yyyy-MM-dd"
                                            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                                            placeholderText="Selecciona una fecha"
                                        />
                                    </div>

                                    {/* Hora de Inicio */}
                                    <div>
                                        <label
                                            htmlFor={`hora_inicio_${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Hora de Inicio
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                id={`hora_inicio_${index}`}
                                                name="hora_inicio"
                                                value={horario.hora_inicio || ''}
                                                onChange={(e) =>
                                                    handleHorarioChange(index, 'hora_inicio', e.target.value)
                                                }
                                                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                                                required
                                            />
                                            <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Hora de Fin */}
                                    <div>
                                        <label
                                            htmlFor={`hora_fin_${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Hora de Fin
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                id={`hora_fin_${index}`}
                                                name="hora_fin"
                                                value={horario.hora_fin || ''}
                                                onChange={(e) =>
                                                    handleHorarioChange(index, 'hora_fin', e.target.value)
                                                }
                                                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                                                required
                                            />
                                            <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label
                                            htmlFor={`estado_${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Estado
                                        </label>
                                        <select
                                            id={`estado_${index}`}
                                            name="estado"
                                            value={horario.estado || 'Disponible'}
                                            onChange={(e) => handleHorarioChange(index, 'estado', e.target.value)}
                                            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                                        >
                                            <option value="Disponible">Disponible</option>
                                            <option value="Reservado">Reservado</option>
                                            <option value="Cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Botón para eliminar horario */}
                                <motion.button
                                    type="button"
                                    onClick={() => removeHorario(index)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-300"
                                >
                                    <FaTrash size={18} />
                                </motion.button>
                            </div>
                        ))}
                        <motion.button
                            type="button"
                            onClick={addHorario}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold shadow-md transition-all duration-300 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                        >
                            <FaPlus className="mr-2" /> Agregar Horario
                        </motion.button>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <motion.button
                            type="button"
                            onClick={handleCloseModal}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2 bg-gray-500 text-white rounded-lg font-medium shadow-md hover:bg-gray-600 transition-all duration-300"
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2 bg-teal-600 text-white rounded-lg font-medium shadow-md hover:bg-teal-700 transition-all duration-300"
                        >
                            Guardar
                        </motion.button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default DoctorList;