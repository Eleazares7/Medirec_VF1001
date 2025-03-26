import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin';
import { AuthContext } from '../../Context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { FaEye, FaEyeSlash, FaPlus, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AddDoctor = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        contrasena: '',
        confirmarContrasena: '',
        nombre: '',
        apellido: '',
        especialidad: '',
        numero_licencia: '',
        foto: null,
        horarios: [],
    });
    const [previewFoto, setPreviewFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Configuración de react-dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
        onDrop: (acceptedFiles, fileRejections) => {
            if (fileRejections.length > 0) {
                if (fileRejections[0].errors[0].code === 'file-too-large') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La imagen no debe exceder los 5MB.',
                        confirmButtonColor: '#0d9488',
                    });
                } else if (fileRejections[0].errors[0].code === 'file-invalid-type') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF).',
                        confirmButtonColor: '#0d9488',
                    });
                }
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                if (previewFoto) {
                    URL.revokeObjectURL(previewFoto);
                }
                const previewUrl = URL.createObjectURL(file);
                setPreviewFoto(previewUrl);
                setFormData((prev) => ({ ...prev, foto: file }));
            }
        },
    });

    // Verificar autenticación
    useEffect(() => {
        if (!user || !user.email) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Limpiar la URL de la vista previa al desmontar el componente
    useEffect(() => {
        return () => {
            if (previewFoto) {
                URL.revokeObjectURL(previewFoto);
            }
        };
    }, [previewFoto]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Manejar cambios en los campos de horarios
    const handleHorarioChange = (index, e) => {
        const { name, value } = e.target;
        const updatedHorarios = [...formData.horarios];
        updatedHorarios[index] = { ...updatedHorarios[index], [name]: value };
        setFormData((prev) => ({ ...prev, horarios: updatedHorarios }));
    };

    // Agregar un nuevo horario
    const addHorario = (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe
        setFormData((prev) => ({
            ...prev,
            horarios: [
                ...prev.horarios,
                {
                    dia_semana: '',
                    fecha: '',
                    hora_inicio: '',
                    hora_fin: '',
                    estado: 'Disponible',
                },
            ],
        }));
    };

    // Eliminar un horario
    const removeHorario = (index) => {
        const updatedHorarios = formData.horarios.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, horarios: updatedHorarios }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validaciones en el frontend
        if (
            !formData.email ||
            !formData.contrasena ||
            !formData.confirmarContrasena ||
            !formData.nombre ||
            !formData.apellido ||
            !formData.especialidad ||
            !formData.numero_licencia ||
            !formData.foto
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos obligatorios.',
                confirmButtonColor: '#0d9488',
            });
            setLoading(false);
            return;
        }

        // Validar que las contraseñas coincidan
        if (formData.contrasena !== formData.confirmarContrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                confirmButtonColor: '#0d9488',
            });
            setLoading(false);
            return;
        }

        // Validar los horarios
        for (const horario of formData.horarios) {
            if (!horario.dia_semana && !horario.fecha) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Debe especificar un día de la semana o una fecha para cada horario.',
                    confirmButtonColor: '#0d9488',
                });
                setLoading(false);
                return;
            }

            if (!horario.hora_inicio || !horario.hora_fin) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, completa todos los campos obligatorios de los horarios.',
                    confirmButtonColor: '#0d9488',
                });
                setLoading(false);
                return;
            }

            // Validar que la hora de inicio sea anterior a la hora de fin
            const inicio = new Date(`1970-01-01T${horario.hora_inicio}:00`);
            const fin = new Date(`1970-01-01T${horario.hora_fin}:00`);
            if (inicio >= fin) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La hora de inicio debe ser anterior a la hora de fin en todos los horarios.',
                    confirmButtonColor: '#0d9488',
                });
                setLoading(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");

            // Crear un FormData con todos los datos
            const doctorFormData = new FormData();
            doctorFormData.append('email', formData.email);
            doctorFormData.append('contrasena', formData.contrasena);
            doctorFormData.append('confirmarContrasena', formData.confirmarContrasena);
            doctorFormData.append('nombre', formData.nombre);
            doctorFormData.append('apellido', formData.apellido);
            doctorFormData.append('especialidad', formData.especialidad);
            doctorFormData.append('numero_licencia', formData.numero_licencia);
            doctorFormData.append('adminEmail', user.email);
            if (formData.foto) {
                doctorFormData.append('foto', formData.foto);
            }
            doctorFormData.append('horarios', JSON.stringify(formData.horarios));

            const response = await fetch('http://localhost:5000/admin/registerDoctor', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: doctorFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar el doctor.');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Doctor registrado exitosamente.',
                confirmButtonColor: '#0d9488',
            });

            setFormData({
                email: '',
                contrasena: '',
                confirmarContrasena: '',
                nombre: '',
                apellido: '',
                especialidad: '',
                numero_licencia: '',
                foto: null,
                horarios: [],
            });
            setShowPassword(false);
            setShowConfirmPassword(false);
            if (previewFoto) {
                URL.revokeObjectURL(previewFoto);
                setPreviewFoto(null);
            }
            setTimeout(() => navigate('/admin/home'), 500);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonColor: '#0d9488',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarAdmin />
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-extrabold text-teal-900 mb-3"
                        >
                            Registrar un Doctor
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 text-lg"
                        >
                            Ingresa los datos para registrar un nuevo doctor
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-teal-900 mb-1">
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                placeholder="ejemplo@hospital.com"
                                required
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="contrasena" className="block text-sm font-medium text-teal-900 mb-1">
                                Contraseña *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="contrasena"
                                    name="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Ingresa una contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal-600 transition-colors duration-200"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-teal-900 mb-1">
                                Confirmar Contraseña *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmarContrasena"
                                    name="confirmarContrasena"
                                    value={formData.confirmarContrasena}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Confirma tu contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-teal-900 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                placeholder="Nombre del doctor"
                                required
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-teal-900 mb-1">
                                Apellido *
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                placeholder="Apellido del doctor"
                                required
                            />
                        </div>

                        {/* Especialidad */}
                        <div>
                            <label htmlFor="especialidad" className="block text-sm font-medium text-teal-900 mb-1">
                                Especialidad *
                            </label>
                            <input
                                type="text"
                                id="especialidad"
                                name="especialidad"
                                value={formData.especialidad}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                placeholder="Ej. Cardiología"
                                required
                            />
                        </div>

                        {/* Número de Licencia */}
                        <div>
                            <label htmlFor="numero_licencia" className="block text-sm font-medium text-teal-900 mb-1">
                                Número de Licencia *
                            </label>
                            <input
                                type="text"
                                id="numero_licencia"
                                name="numero_licencia"
                                value={formData.numero_licencia}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                placeholder="Número de licencia médica"
                                required
                            />
                        </div>

                        {/* Foto con react-dropzone */}
                        <div>
                            <label className="block text-sm font-medium text-teal-900 mb-2">
                                Foto *
                            </label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-teal-300 bg-teal-50 hover:bg-teal-100 hover:border-teal-400'}`}
                            >
                                <input {...getInputProps()} />
                                {formData.foto ? (
                                    <p className="text-teal-900 font-medium">
                                        Archivo seleccionado: <span className="text-gray-600">{formData.foto.name}</span>
                                    </p>
                                ) : isDragActive ? (
                                    <p className="text-teal-900 font-medium">Suelta la imagen aquí...</p>
                                ) : (
                                    <p className="text-teal-900 font-medium">
                                        Arrastra y suelta una imagen aquí, o <span className="text-teal-600 underline">haz clic para seleccionarla</span>
                                    </p>
                                )}
                            </div>
                            {previewFoto && (
                                <motion.div
                                    className="flex justify-center mt-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img
                                        src={previewFoto}
                                        alt="Vista previa de la foto"
                                        className="w-40 h-40 rounded-full object-cover border-4 border-teal-500 shadow-md"
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Horarios */}
                        <div>
                            <label className="block text-sm font-medium text-teal-900 mb-2">
                                Horarios del Doctor
                            </label>
                            {formData.horarios.map((horario, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border border-teal-200 rounded-lg p-4 mb-4 relative"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Día de la semana */}
                                        <div>
                                            <label
                                                htmlFor={`dia_semana_${index}`}
                                                className="block text-sm font-medium text-teal-900 mb-1"
                                            >
                                                Día de la Semana *
                                            </label>
                                            <select
                                                id={`dia_semana_${index}`}
                                                name="dia_semana"
                                                value={horario.dia_semana}
                                                onChange={(e) => handleHorarioChange(index, e)}
                                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800"
                                                required
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
                                                className="block text-sm font-medium text-teal-900 mb-1"
                                            >
                                                Fecha (Opcional)
                                            </label>
                                            <input
                                                type="date"
                                                id={`fecha_${index}`}
                                                name="fecha"
                                                value={horario.fecha}
                                                onChange={(e) => handleHorarioChange(index, e)}
                                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800"
                                            />
                                        </div>

                                        {/* Hora de Inicio */}
                                        <div>
                                            <label
                                                htmlFor={`hora_inicio_${index}`}
                                                className="block text-sm font-medium text-teal-900 mb-1"
                                            >
                                                Hora de Inicio *
                                            </label>
                                            <input
                                                type="time"
                                                id={`hora_inicio_${index}`}
                                                name="hora_inicio"
                                                value={horario.hora_inicio}
                                                onChange={(e) => handleHorarioChange(index, e)}
                                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800"
                                                required
                                            />
                                        </div>

                                        {/* Hora de Fin */}
                                        <div>
                                            <label
                                                htmlFor={`hora_fin_${index}`}
                                                className="block text-sm font-medium text-teal-900 mb-1"
                                            >
                                                Hora de Fin *
                                            </label>
                                            <input
                                                type="time"
                                                id={`hora_fin_${index}`}
                                                name="hora_fin"
                                                value={horario.hora_fin}
                                                onChange={(e) => handleHorarioChange(index, e)}
                                                className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Botón para eliminar horario */}
                                    <button
                                        type="button"
                                        onClick={() => removeHorario(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </motion.div>
                            ))}

                            {/* Botón para agregar un nuevo horario */}
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

                        {/* Botones */}
                        <div className="flex justify-between gap-4 mt-8">
                            <motion.button
                                type="button"
                                onClick={() => navigate('/admin/users/manageDoctors')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-1 px-6 py-3 bg-teal-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'}`}
                            >
                                {loading ? 'Registrando...' : 'Registrar Doctor'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default AddDoctor;