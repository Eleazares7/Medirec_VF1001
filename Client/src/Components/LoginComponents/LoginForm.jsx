import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({ handleSubmit, formData, handleChange, buttonVariants, childVariants }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <motion.form
            className="w-full max-w-md bg-white text-teal-800 p-8 rounded-2xl shadow-xl border border-teal-200"
            onSubmit={handleSubmit}
            variants={childVariants}
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
                        type={showPassword ? "text" : "password"}
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
                ¿No tienes cuenta?{" "}
                <a href="/registerPatient" className="underline hover:text-teal-800">
                    Regístrate aquí
                </a>
            </motion.p>
        </motion.form>
    );
};

export default LoginForm;