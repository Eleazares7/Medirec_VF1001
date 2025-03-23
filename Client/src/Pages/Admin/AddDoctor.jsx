import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin';
import { AuthContext } from '../../Context/AuthContext';
import { useDropzone } from 'react-dropzone';

const AddDoctor = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        contrasena: '',
        nombre: '',
        apellido: '',
        especialidad: '',
        numero_licencia: '',
        foto: null,
    });
    const [previewFoto, setPreviewFoto] = useState(null); // Estado para la vista previa de la foto
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Configuración de react-dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
        maxSize: 5 * 1024 * 1024, // Límite de 5MB
        multiple: false, // Solo permitir un archivo
        onDrop: (acceptedFiles, fileRejections) => {
            if (fileRejections.length > 0) {
                if (fileRejections[0].errors[0].code === 'file-too-large') {
                    setError('La imagen no debe exceder los 5MB.');
                } else if (fileRejections[0].errors[0].code === 'file-invalid-type') {
                    setError('Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF).');
                }
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                // Limpiar la URL anterior si existe
                if (previewFoto) {
                    URL.revokeObjectURL(previewFoto);
                }
                // Generar una nueva URL para la vista previa
                const previewUrl = URL.createObjectURL(file);
                setPreviewFoto(previewUrl);
                setFormData((prev) => ({ ...prev, foto: file }));
                setError('');
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

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validaciones
        if (!formData.email || !formData.contrasena || !formData.nombre || !formData.apellido || !formData.especialidad || !formData.numero_licencia) {
            setError('Por favor, completa todos los campos obligatorios.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            // 1. Crear el usuario en la tabla `usuarios`
            const userFormData = new FormData();
            userFormData.append('email', formData.email);
            userFormData.append('contrasena', formData.contrasena);
            userFormData.append('rol', 'medico');

            const userResponse = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: userFormData,
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.message || 'Error al crear el usuario.');
            }

            const userData = await userResponse.json();
            const id_usuario = userData.id_usuario; // Obtenemos el ID del usuario creado

            // 2. Crear el doctor en la tabla `medicos`
            const doctorFormData = new FormData();
            doctorFormData.append('id_usuario', id_usuario);
            doctorFormData.append('nombre', formData.nombre);
            doctorFormData.append('apellido', formData.apellido);
            doctorFormData.append('especialidad', formData.especialidad);
            doctorFormData.append('numero_licencia', formData.numero_licencia);
            if (formData.foto) {
                doctorFormData.append('foto', formData.foto);
            }

            const doctorResponse = await fetch('http://localhost:5000/admin/doctors', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: doctorFormData,
            });

            if (!doctorResponse.ok) {
                const errorData = await doctorResponse.json();
                throw new Error(errorData.message || 'Error al registrar el doctor.');
            }

            setSuccess('Doctor registrado exitosamente.');
            setFormData({
                email: '',
                contrasena: '',
                nombre: '',
                apellido: '',
                especialidad: '',
                numero_licencia: '',
                foto: null,
            });
            // Limpiar la vista previa
            if (previewFoto) {
                URL.revokeObjectURL(previewFoto);
                setPreviewFoto(null);
            }
            setTimeout(() => navigate('/admin/users/doctors'), 2000); // Redirigir después de 2 segundos
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarAdmin />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl font-bold text-teal-800 mb-4"
                        >
                            Registrar un Doctor
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 text-lg"
                        >
                            Completa los datos para registrar un nuevo doctor
                        </motion.p>
                    </div>

                    {/* Mensajes de error o éxito */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 p-3 bg-red-100 text-red-800 rounded-md"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 p-3 bg-green-100 text-green-800 rounded-md"
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-teal-800">
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="ejemplo@hospital.com"
                                required
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="contrasena" className="block text-sm font-medium text-teal-800">
                                Contraseña *
                            </label>
                            <input
                                type="password"
                                id="contrasena"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Ingresa una contraseña"
                                required
                            />
                        </div>

                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-teal-800">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Nombre del doctor"
                                required
                            />
                        </div>

                        {/* Apellido */}
                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-teal-800">
                                Apellido *
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Apellido del doctor"
                                required
                            />
                        </div>

                        {/* Especialidad */}
                        <div>
                            <label htmlFor="especialidad" className="block text-sm font-medium text-teal-800">
                                Especialidad *
                            </label>
                            <input
                                type="text"
                                id="especialidad"
                                name="especialidad"
                                value={formData.especialidad}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Ej. Cardiología"
                                required
                            />
                        </div>

                        {/* Número de Licencia */}
                        <div>
                            <label htmlFor="numero_licencia" className="block text-sm font-medium text-teal-800">
                                Número de Licencia *
                            </label>
                            <input
                                type="text"
                                id="numero_licencia"
                                name="numero_licencia"
                                value={formData.numero_licencia}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-teal-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Número de licencia médica"
                                required
                            />
                        </div>

                        {/* Foto con react-dropzone */}
                        <div>
                            <label className="block text-sm font-medium text-teal-800 mb-1">
                                Foto (Opcional)
                            </label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-md p-6 text-center transition-colors duration-300 ${
                                    isDragActive ? 'border-teal-500 bg-teal-50' : 'border-teal-300 bg-teal-50 hover:bg-teal-100'
                                }`}
                            >
                                <input {...getInputProps()} />
                                {formData.foto ? (
                                    <p className="text-teal-800">Archivo seleccionado: {formData.foto.name}</p>
                                ) : isDragActive ? (
                                    <p className="text-teal-800">Suelta la imagen aquí...</p>
                                ) : (
                                    <p className="text-teal-800">
                                        Arrastra y suelta una imagen aquí, o haz clic para seleccionarla
                                    </p>
                                )}
                            </div>
                            {/* Vista previa de la foto */}
                            {previewFoto && (
                                <motion.img
                                    src={previewFoto}
                                    alt="Vista previa de la foto"
                                    className="w-32 h-32 rounded-full mx-auto mt-4 object-cover border-2 border-teal-600"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-between">
                            <motion.button
                                type="button"
                                onClick={() => navigate('/admin/users/doctors')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-gray-500 text-white rounded-full font-medium shadow-md transition-colors duration-300 hover:bg-gray-600"
                            >
                                Cancelar
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2 bg-teal-600 text-white rounded-full font-medium shadow-md transition-colors duration-300 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-500'
                                }`}
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