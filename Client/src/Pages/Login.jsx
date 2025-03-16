import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../Components/NavBar';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        contrasena: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: data.message || 'Inicio de sesión exitoso',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'bg-teal-50 rounded-lg shadow-lg',
                        title: 'text-2xl font-bold text-teal-800',
                        confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                    },
                });
                // Aquí podrías redirigir al usuario o limpiar el formulario
                setFormData({ email: '', contrasena: '' });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Credenciales inválidas',
                    confirmButtonText: 'Cerrar',
                    customClass: {
                        popup: 'bg-teal-50 rounded-lg shadow-lg',
                        title: 'text-2xl font-bold text-teal-800',
                        confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                    },
                });
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al iniciar sesión. Por favor, intenta de nuevo.',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'bg-teal-50 rounded-lg shadow-lg',
                    title: 'text-2xl font-bold text-teal-800',
                    confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                },
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.3 },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: 'easeInOut',
            },
        },
    };

    const buttonVariants = {
        hover: { scale: 1.1, transition: { duration: 0.3 } },
        tap: { scale: 0.95 },
        pulse: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } },
    };

    return (
        <>
            <Navbar />
            <motion.section
                className="w-full min-h-screen bg-teal-800 text-white flex items-center justify-center relative overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    style={{ backgroundSize: '200% 200%' }}
                />
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,125,128,0.2)_70%)]" />
                </motion.div>
                <motion.svg
                    className="absolute top-10 left-10 w-32 h-32 text-teal-600 opacity-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <path stroke="currentColor" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                </motion.svg>
                <motion.svg
                    className="absolute bottom-20 right-20 w-40 h-40 text-teal-500 opacity-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ y: [-20, 0, -20] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <path stroke="currentColor" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </motion.svg>

                <motion.div
                    className="container mx-auto px-6 py-16 flex flex-col items-center z-10"
                    variants={containerVariants}
                >
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-6 text-center"
                        variants={childVariants}
                    >
                        Iniciar Sesión
                    </motion.h1>

                    <motion.form
                        className="w-full max-w-md bg-white text-teal-800 p-8 rounded-2xl shadow-xl border border-teal-200"
                        onSubmit={handleSubmit}
                        variants={containerVariants}
                    >
                        <motion.div variants={childVariants} className="mb-6">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                required
                            />
                        </motion.div>

                        <motion.div variants={childVariants} className="mb-6 relative">
                            <label className="block text-sm font-medium mb-2" htmlFor="contrasena">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="contrasena"
                                    id="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            className="w-full bg-teal-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg flex items-center justify-center"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            animate="pulse"
                        >
                            Iniciar Sesión
                            <motion.svg
                                className="w-6 h-6 ml-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </motion.svg>
                        </motion.button>

                        <motion.p
                            className="mt-4 text-center text-sm text-teal-600"
                            variants={childVariants}
                        >
                            ¿No tienes cuenta?{' '}
                            <a href="/registerPatient" className="underline hover:text-teal-800">
                                Regístrate aquí
                            </a>
                        </motion.p>
                    </motion.form>
                </motion.div>
            </motion.section>
        </>
    );
};

export default Login;