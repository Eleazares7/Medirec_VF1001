import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Añadir para navegación

import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import variants from '../Utils/RegisterPatient/animations.js'
const [childVariants, containerVariants, buttonVariants] = variants;

const OtpScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
    const [isExpired, setIsExpired] = useState(false);
    const inputRefs = useRef([]);
    const email = location.state?.email; // Obtener email desde el estado

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
        if (timeLeft > 0 && !isExpired) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setIsExpired(true);
            Swal.fire({
                icon: 'warning',
                title: '¡Código Expirado!',
                text: 'El código OTP ha expirado. Por favor, solicita uno nuevo.',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'bg-teal-50 rounded-lg shadow-lg',
                    title: 'text-2xl font-bold text-teal-800',
                    confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                },
            });
        }
    }, [timeLeft, isExpired, email, navigate]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index, value) => {
        if (isExpired) return;
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (isExpired) return;
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isExpired) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El código OTP ha expirado. Por favor, solicita uno nuevo.',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'bg-teal-50 rounded-lg shadow-lg',
                    title: 'text-2xl font-bold text-teal-800',
                    confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                },
            });
            return;
        }

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, ingresa un código OTP de 6 dígitos.',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'bg-teal-50 rounded-lg shadow-lg',
                    title: 'text-2xl font-bold text-teal-800',
                    confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                },
            });
            return;
        }

        try {
            // Verificar OTP
            const verifyResponse = await fetch('http://localhost:5000/2fa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: otpCode }),
                credentials: 'include',
            });
            const verifyData = await verifyResponse.json();

            // Verificar si el OTP fue correcto
            if (!verifyResponse.ok || !verifyData.success) {
                throw new Error(verifyData.message || 'Código OTP inválido');
            }

            // Si el OTP es válido, proceder a guardar los datos
            const saveResponse = await fetch('http://localhost:5000/users/save-patient-after-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });
            const saveData = await saveResponse.json();

            if (saveResponse.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: saveData.message || 'Paciente registrado exitosamente',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'bg-teal-50 rounded-lg shadow-lg',
                        title: 'text-2xl font-bold text-teal-800',
                        confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                    },
                }).then(() => {
                    navigate('/login');
                });
                setOtp(['', '', '', '', '', '']);
                setTimeLeft(300);
                setIsExpired(false);
            } else {
                throw new Error(saveData.error || 'Error al guardar los datos');
            }
        } catch (error) {
            console.error('Error en la verificación o guardado:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al verificar el OTP o guardar los datos.',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'bg-teal-50 rounded-lg shadow-lg',
                    title: 'text-2xl font-bold text-teal-800',
                    confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                },
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            const resendResponse = await fetch('http://localhost:5000/2fa/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                credentials: 'include', // Añadir esto
            });
            const resendData = await resendResponse.json();

            if (resendResponse.ok && resendData.success) {
                setOtp(['', '', '', '', '', '']);
                setTimeLeft(300);
                setIsExpired(false);
                Swal.fire({
                    icon: 'success',
                    title: '¡OTP Reenviado!',
                    text: 'Se ha enviado un nuevo código OTP. Revisa tu correo.',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                        popup: 'bg-teal-50 rounded-lg shadow-lg',
                        title: 'text-2xl font-bold text-teal-800',
                        confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                    },
                });
            } else {
                throw new Error(resendData.message || 'Error al reenviar el OTP');
            }
        } catch (error) {
            console.error('Error al reenviar OTP:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo reenviar el OTP.',
                confirmButtonText: 'Cerrar',
                customClass: {
                    popup: 'bg-teal-50 rounded-lg shadow-lg',
                    title: 'text-2xl font-bold text-teal-800',
                    confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
                },
            });
        }
    };



    return (
        <>

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
                        Verificar Código OTP
                    </motion.h1>

                    <motion.form
                        className="w-full max-w-md bg-white text-teal-800 p-8 rounded-2xl shadow-xl border border-teal-200"
                        onSubmit={handleSubmit}
                        variants={containerVariants}
                    >
                        <motion.div variants={childVariants} className="mb-6">
                            <label className="block text-sm font-medium mb-4 text-center">
                                Ingresa el código OTP de 6 dígitos
                            </label>
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className="w-12 h-12 text-center text-xl border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                ))}
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
                            Verificar OTP
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
                            ¿No recibiste el código?{' '}
                            <a href="/resend-otp" className="underline hover:text-teal-800">
                                Reenviar OTP
                            </a>
                        </motion.p>
                    </motion.form>
                </motion.div>
            </motion.section>
        </>
    );
};

export default OtpScreen;