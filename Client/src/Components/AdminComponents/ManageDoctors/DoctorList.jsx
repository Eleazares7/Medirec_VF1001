import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const DoctorList = ({ doctors, onBack, fetchDoctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Doctor seleccionado para editar
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

  // Función para abrir el modal con los datos del doctor
  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  // Función para actualizar un doctor
  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el doctor');
      }

      const data = await response.json();
      console.log('Doctor actualizado:', data);
      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Doctor actualizado correctamente',
        confirmButtonColor: '#0d9488',
      });
      // Refrescar la lista de doctores
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
      html: `¿Deseas eliminar al doctor <strong>${doctor.nombre}</strong>? <br> 
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
          // Refrescar la lista de doctores
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
      className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-teal-800">Lista de Doctores</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onBack}
          className="px-6 py-2 bg-teal-600 text-white rounded-full font-medium shadow-md hover:bg-teal-500"
        >
          Volver a Opciones
        </motion.button>
      </div>
      <div className="bg-teal-50 p-6 rounded-md shadow-md">
        {doctors.length === 0 ? (
          <p className="text-gray-600 text-center">No hay doctores registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-teal-800">
                  <th className="p-3">Foto</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Apellido</th>
                  <th className="p-3">Especialidad</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Número de Licencia</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor, index) => (
                  <motion.tr
                    key={doctor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-t border-teal-100 hover:bg-teal-100"
                  >
                    <td className="p-3">
                      {doctor.foto ? (
                        <img
                          src={doctor.foto}
                          alt={`Foto de ${doctor.nombre}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
                        />
                      ) : (
                        <span className="text-gray-500">Sin foto</span>
                      )}
                    </td>
                    <td className="p-3">{doctor.nombre}</td>
                    <td className="p-3">{doctor.apellido}</td>
                    <td className="p-3">{doctor.especialidad}</td>
                    <td className="p-3">{doctor.email}</td>
                    <td className="p-3">{doctor.numero_licencia}</td>
                    <td className="p-3 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleEdit(doctor)}
                        className="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-500"
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
                        onClick={() => handleDelete(doctor)}
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-500"
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
      {isModalOpen && selectedDoctor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold text-teal-800 mb-4">Editar Doctor</h3>
            <div className="flex justify-center mb-4">
              {selectedDoctor.foto ? (
                <img
                  src={selectedDoctor.foto}
                  alt={`Foto de ${selectedDoctor.nombre}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-teal-500"
                />
              ) : (
                <span className="text-gray-500 text-lg">Sin foto</span>
              )}
            </div>
            <form onSubmit={handleUpdateDoctor}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={selectedDoctor.nombre}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, nombre: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Apellido</label>
                <input
                  type="text"
                  value={selectedDoctor.apellido}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, apellido: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Especialidad</label>
                <input
                  type="text"
                  value={selectedDoctor.especialidad}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, especialidad: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={selectedDoctor.email}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, email: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Licencia</label>
                <input
                  type="text"
                  value={selectedDoctor.numero_licencia}
                  onChange={(e) =>
                    setSelectedDoctor({ ...selectedDoctor, numero_licencia: e.target.value })
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500"
                >
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorList;