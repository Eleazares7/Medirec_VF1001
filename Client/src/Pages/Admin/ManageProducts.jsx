// src/Components/AdminComponents/ManageProducts.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin.jsx';

const mockSalesStats = {
    totalSales: 1250,
    monthlySales: 320,
    topProduct: 'Amoxicilina',
};

const mockProducts = [
    {
        id_medicamento: 1,
        nombre: 'Amoxicilina',
        precio: 25.75,
        stock: 50,
        categoria: 'Antibiótico',
        contenido_neto: '500 mg',
        presentacion: 'Cápsulas',
        requiere_receta: true,
    },
    {
        id_medicamento: 2,
        nombre: 'Paracetamol',
        precio: 15.50,
        stock: 100,
        categoria: 'Medicamento',
        contenido_neto: '500 mg',
        presentacion: 'Tabletas',
        requiere_receta: false,
    },
];

const ManageProducts = () => {
    const [salesStats, setSalesStats] = useState(mockSalesStats);
    const [products, setProducts] = useState(mockProducts);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setSalesStats(mockSalesStats);
            setProducts(mockProducts);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <>
                <NavbarAdmin />
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                        <svg
                            className="animate-spin h-10 w-10 text-teal-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <p className="text-teal-800 text-xl font-semibold">Cargando gestión de productos...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarAdmin />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="max-w-5xl w-full bg-white rounded-xl shadow-2xl p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl font-bold text-teal-800"
                        >
                            Administrar Productos
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeInOut' }}
                            className="text-gray-600 mt-2"
                        >
                            Revisa estadísticas y gestiona tu inventario
                        </motion.p>
                    </div>

                    {/* Estadísticas de Ventas */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Estadísticas de Ventas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-teal-50 p-4 rounded-lg shadow-md">
                                <p className="text-gray-600 text-sm">Ventas Totales</p>
                                <p className="text-2xl font-bold text-teal-800">${salesStats.totalSales}</p>
                            </div>
                            <div className="bg-teal-50 p-4 rounded-lg shadow-md">
                                <p className="text-gray-600 text-sm">Ventas Mensuales</p>
                                <p className="text-2xl font-bold text-teal-800">${salesStats.monthlySales}</p>
                            </div>
                            <div className="bg-teal-50 p-4 rounded-lg shadow-md">
                                <p className="text-gray-600 text-sm">Producto Más Vendido</p>
                                <p className="text-2xl font-bold text-teal-800">{salesStats.topProduct}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Botón para Agregar Producto */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-8 flex justify-end"
                    >
                        <button
                            onClick={() => navigate('/admin/products/addProduct')}
                            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 shadow-md"
                        >
                            + Agregar Producto
                        </button>
                    </motion.div>

                    {/* Lista de Productos */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Lista de Productos</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border rounded-lg shadow-md">
                                <thead>
                                    <tr className="bg-teal-100">
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">ID</th>
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">Nombre</th>
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">Precio</th>
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">Stock</th>
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">Categoría</th>
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">Contenido</th>
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">Presentación</th>
                                        <th className="p-3 text-left text-teal-800 text-sm font-semibold">Receta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <motion.tr
                                            key={product.id_medicamento}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="p-3 text-gray-700">{product.id_medicamento}</td>
                                            <td className="p-3 text-gray-700">{product.nombre}</td>
                                            <td className="p-3 text-gray-700">${product.precio.toFixed(2)}</td>
                                            <td className="p-3 text-gray-700">{product.stock}</td>
                                            <td className="p-3 text-gray-700">{product.categoria}</td>
                                            <td className="p-3 text-gray-700">{product.contenido_neto}</td>
                                            <td className="p-3 text-gray-700">{product.presentacion}</td>
                                            <td className="p-3 text-gray-700">{product.requiere_receta ? 'Sí' : 'No'}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default ManageProducts;