// src/Components/AdminComponents/AddProduct.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin.jsx';

const AddProduct = () => {
    const [newProduct, setNewProduct] = useState({
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
    const navigate = useNavigate();

    const handleAddProduct = (e) => {
        e.preventDefault();
        if (!newProduct.nombre || !newProduct.precio || !newProduct.stock || !newProduct.categoria) {
            alert('Por favor, completa los campos obligatorios: Nombre, Precio, Stock y Categoría.');
            return;
        }

        // Aquí podrías enviar los datos al backend con fetch/axios
        console.log('Producto a agregar:', newProduct);

        // Redirigir a la pantalla de gestión de productos después de agregar
        navigate('/admin/manageProducts');
    };

    return (
        <>
            <NavbarAdmin />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8"
                >
                    <div className="text-center mb-8">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl font-bold text-teal-800"
                        >
                            Agregar Nuevo Producto
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 mt-2"
                        >
                            Completa los detalles para añadir un nuevo medicamento o producto
                        </motion.p>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-6">
                        {/* Campos Principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    value={newProduct.nombre}
                                    onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                                <input
                                    type="number"
                                    value={newProduct.precio}
                                    onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                                <select
                                    value={newProduct.categoria}
                                    onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={newProduct.descripcion}
                                    onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewProduct({ ...newProduct, foto: e.target.files[0] })}
                                    className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido Neto</label>
                                <input
                                    type="text"
                                    value={newProduct.contenido_neto}
                                    onChange={(e) => setNewProduct({ ...newProduct, contenido_neto: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="e.g., 500 mg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                                <input
                                    type="text"
                                    value={newProduct.unidad_medida}
                                    onChange={(e) => setNewProduct({ ...newProduct, unidad_medida: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="e.g., mg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Presentación</label>
                                <input
                                    type="text"
                                    value={newProduct.presentacion}
                                    onChange={(e) => setNewProduct({ ...newProduct, presentacion: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="e.g., Tabletas"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                                <input
                                    type="date"
                                    value={newProduct.fecha_vencimiento}
                                    onChange={(e) => setNewProduct({ ...newProduct, fecha_vencimiento: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lote</label>
                                <input
                                    type="text"
                                    value={newProduct.lote}
                                    onChange={(e) => setNewProduct({ ...newProduct, lote: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                <input
                                    type="text"
                                    value={newProduct.proveedor}
                                    onChange={(e) => setNewProduct({ ...newProduct, proveedor: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Campos de Texto Largos */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones</label>
                                <textarea
                                    value={newProduct.indicaciones}
                                    onChange={(e) => setNewProduct({ ...newProduct, indicaciones: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraindicaciones</label>
                                <textarea
                                    value={newProduct.contraindicaciones}
                                    onChange={(e) => setNewProduct({ ...newProduct, contraindicaciones: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                        </div>

                        {/* Checkboxes y Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={newProduct.requiere_receta}
                                    onChange={(e) => setNewProduct({ ...newProduct, requiere_receta: e.target.checked })}
                                    className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Requiere Receta</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={newProduct.es_antibiotioco}
                                    onChange={(e) => setNewProduct({ ...newProduct, es_antibiotioco: e.target.checked })}
                                    className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Es Antibiótico</span>
                            </label>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                <select
                                    value={newProduct.estado}
                                    onChange={(e) => setNewProduct({ ...newProduct, estado: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/manageProducts')}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                            >
                                Agregar Producto
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default AddProduct;