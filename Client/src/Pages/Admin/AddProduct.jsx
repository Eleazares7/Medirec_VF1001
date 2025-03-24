// src/Components/AdminComponents/AddProduct.jsx

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin';
import { AuthContext } from '../../Context/AuthContext';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        foto: null,
        categoria: '',
        contenido_neto: '',
        unidad_medida: '',
        presentacion: '',
        requiere_receta: false,
        es_antibiotioco: false,
        indicaciones: '',
        contraindicaciones: '',
        fecha_vencimiento: '',
        lote: '',
        proveedor: '',
        estado: 'Activo',
    });
    const [previewFoto, setPreviewFoto] = useState(null);
    const [loading, setLoading] = useState(false);

    // Configuración de react-dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
        maxSize: 5 * 1024 * 1024, // Límite de 5MB
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
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validaciones en el frontend
        if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa los campos obligatorios: Nombre, Precio, Stock y Categoría.',
                confirmButtonColor: '#0d9488',
            });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            // Crear un FormData con todos los datos
            const medicineFormData = new FormData();
            medicineFormData.append('nombre', formData.nombre);
            medicineFormData.append('descripcion', formData.descripcion);
            medicineFormData.append('precio', parseFloat(formData.precio));
            medicineFormData.append('stock', parseInt(formData.stock));
            if (formData.foto) {
                medicineFormData.append('foto', formData.foto); // El archivo de imagen
            }
            medicineFormData.append('categoria', formData.categoria);
            medicineFormData.append('contenido_neto', formData.contenido_neto);
            medicineFormData.append('unidad_medida', formData.unidad_medida);
            medicineFormData.append('presentacion', formData.presentacion);
            medicineFormData.append('requiere_receta', formData.requiere_receta);
            medicineFormData.append('es_antibiotioco', formData.es_antibiotioco);
            medicineFormData.append('indicaciones', formData.indicaciones);
            medicineFormData.append('contraindicaciones', formData.contraindicaciones);
            medicineFormData.append('fecha_vencimiento', formData.fecha_vencimiento);
            medicineFormData.append('lote', formData.lote);
            medicineFormData.append('proveedor', formData.proveedor);
            medicineFormData.append('estado', formData.estado);
            medicineFormData.append('adminEmail', user.email);
            console.log(formData);
             // Enviar el correo del administrador autenticado

            // Enviar todos los datos al endpoint /admin/medicine/addMedicine
            const response = await fetch('http://localhost:5000/admin/medicine/addMedicine', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: medicineFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar el medicamento.');
            }

            // Mostrar mensaje de éxito con SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Medicamento registrado exitosamente.',
                confirmButtonColor: '#0d9488',
            });

            // Limpiar el formulario
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                foto: null,
                categoria: '',
                contenido_neto: '',
                unidad_medida: '',
                presentacion: '',
                requiere_receta: false,
                es_antibiotioco: false,
                indicaciones: '',
                contraindicaciones: '',
                fecha_vencimiento: '',
                lote: '',
                proveedor: '',
                estado: 'Activo',
            });
            if (previewFoto) {
                URL.revokeObjectURL(previewFoto);
                setPreviewFoto(null);
            }
            setTimeout(() => navigate('/admin/manageProducts'), 500); // Redirigir después de 0.5 segundos
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al registrar el medicamento.',
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
                    className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-extrabold text-teal-900 mb-3"
                        >
                            Agregar Medicamento
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 text-lg"
                        >
                            Ingresa los datos para registrar un nuevo medicamento o producto
                        </motion.p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campos Principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    placeholder="Ej. Amoxicilina"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="precio" className="block text-sm font-medium text-teal-900 mb-1">
                                    Precio *
                                </label>
                                <input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    step="0.01"
                                    placeholder="Ej. 25.75"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-teal-900 mb-1">
                                    Stock *
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Ej. 50"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="categoria" className="block text-sm font-medium text-teal-900 mb-1">
                                    Categoría *
                                </label>
                                <select
                                    id="categoria"
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="Medicamento">Medicamento</option>
                                    <option value="Antibiótico">Antibiótico</option>
                                    <option value="Insumo médico">Insumo médico</option>
                                    <option value="OTC">OTC</option>
                                </select>
                            </div>
                        </div>

                        {/* Campos Adicionales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-teal-900 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    rows="3"
                                    placeholder="Ej. Antibiótico de amplio espectro"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-teal-900 mb-2">
                                    Foto
                                </label>
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${isDragActive ? 'border-teal-500 bg-teal-50' : 'border-teal-300 bg-teal-50 hover:bg-teal-100 hover:border-teal-400'}`}
                                >
                                    <input {...getInputProps()} />
                                    {formData.foto ? (
                                        <p className="text-teal-900 font-medium">Archivo seleccionado: <span className="text-gray-600">{formData.foto.name}</span></p>
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
                                            alt="Vista previa del medicamento"
                                            className="w-32 h-32 rounded-lg object-cover border-4 border-teal-500 shadow-md"
                                        />
                                    </motion.div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="contenido_neto" className="block text-sm font-medium text-teal-900 mb-1">
                                    Contenido Neto
                                </label>
                                <input
                                    type="text"
                                    id="contenido_neto"
                                    name="contenido_neto"
                                    value={formData.contenido_neto}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Ej. 500 mg"
                                />
                            </div>
                            <div>
                                <label htmlFor="unidad_medida" className="block text-sm font-medium text-teal-900 mb-1">
                                    Unidad de Medida
                                </label>
                                <input
                                    type="text"
                                    id="unidad_medida"
                                    name="unidad_medida"
                                    value={formData.unidad_medida}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Ej. mg"
                                />
                            </div>
                            <div>
                                <label htmlFor="presentacion" className="block text-sm font-medium text-teal-900 mb-1">
                                    Presentación
                                </label>
                                <input
                                    type="text"
                                    id="presentacion"
                                    name="presentacion"
                                    value={formData.presentacion}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Ej. Cápsulas"
                                />
                            </div>
                            <div>
                                <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-teal-900 mb-1">
                                    Fecha de Vencimiento
                                </label>
                                <input
                                    type="date"
                                    id="fecha_vencimiento"
                                    name="fecha_vencimiento"
                                    value={formData.fecha_vencimiento}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800"
                                />
                            </div>
                            <div>
                                <label htmlFor="lote" className="block text-sm font-medium text-teal-900 mb-1">
                                    Lote
                                </label>
                                <input
                                    type="text"
                                    id="lote"
                                    name="lote"
                                    value={formData.lote}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Ej. LOT12345"
                                />
                            </div>
                            <div>
                                <label htmlFor="proveedor" className="block text-sm font-medium text-teal-900 mb-1">
                                    Proveedor
                                </label>
                                <input
                                    type="text"
                                    id="proveedor"
                                    name="proveedor"
                                    value={formData.proveedor}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    placeholder="Ej. Genfar"
                                />
                            </div>
                        </div>

                        {/* Campos de Texto Largos */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="indicaciones" className="block text-sm font-medium text-teal-900 mb-1">
                                    Indicaciones
                                </label>
                                <textarea
                                    id="indicaciones"
                                    name="indicaciones"
                                    value={formData.indicaciones}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    rows="3"
                                    placeholder="Ej. 1 cápsula cada 8 horas"
                                />
                            </div>
                            <div>
                                <label htmlFor="contraindicaciones" className="block text-sm font-medium text-teal-900 mb-1">
                                    Contraindicaciones
                                </label>
                                <textarea
                                    id="contraindicaciones"
                                    name="contraindicaciones"
                                    value={formData.contraindicaciones}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800 placeholder-gray-400"
                                    rows="3"
                                    placeholder="Ej. No usar en alérgicos a penicilina"
                                />
                            </div>
                        </div>

                        {/* Checkboxes y Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="requiere_receta"
                                    checked={formData.requiere_receta}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-teal-600 border-teal-200 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-teal-900">Requiere Receta</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="es_antibiotioco"
                                    checked={formData.es_antibiotioco}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-teal-600 border-teal-200 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-teal-900">Es Antibiótico</span>
                            </label>
                            <div>
                                <label htmlFor="estado" className="block text-sm font-medium text-teal-900 mb-1">
                                    Estado
                                </label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-teal-50/50 text-gray-800"
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-between gap-4 mt-8">
                            <motion.button
                                type="button"
                                onClick={() => navigate('/admin/manageProducts')}
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
                                {loading ? 'Registrando...' : 'Agregar Medicamento'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default AddProduct;