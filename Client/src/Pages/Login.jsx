// src/Login.jsx
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/NavBar";
import { AuthContext } from "../Context/AuthContext.jsx";
import LoginForm from "../Components/LoginComponents/LoginForm.jsx";
import BackgroundDecorations from "../Components/LoginComponents/BackgroundDecorations.jsx";
import variants from '../Utils/animations.js';

const [containerVariants, childVariants, buttonVariants] = variants;

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        contrasena: "",
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/login/loginValidation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contrasena: formData.contrasena,
                    email: formData.email,
                }),
            });

            const data = await response.json();
            console.log("Respuesta de login:", data);

            if (response.ok) {
                login(
                    { id: data.id, email: data.email, role: data.role }, // Incluye id
                    data.token
                );

                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: data.message || "Inicio de sesión exitoso",
                    confirmButtonText: "Aceptar",
                    customClass: {
                        popup: "bg-teal-50 rounded-lg shadow-lg",
                        title: "text-2xl font-bold text-teal-800",
                        confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                    },
                }).then(() => {
                    if (data.role === 1) {
                        navigate("/patient/home");
                    } else if(data.role === 3){
                        navigate("/admin/home")
                    }else {
                        navigate("/");
                    }
                    setFormData({ email: "", contrasena: "" });
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "Credenciales inválidas",
                    confirmButtonText: "Cerrar",
                    customClass: {
                        popup: "bg-teal-50 rounded-lg shadow-lg",
                        title: "text-2xl font-bold text-teal-800",
                        confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                    },
                });
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al iniciar sesión. Por favor, intenta de nuevo.",
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "bg-teal-50 rounded-lg shadow-lg",
                    title: "text-2xl font-bold text-teal-800",
                    confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                },
            });
        }
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
                <BackgroundDecorations />
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
                    <LoginForm
                        handleSubmit={handleSubmit}
                        formData={formData}
                        handleChange={handleChange}
                        buttonVariants={buttonVariants}
                        childVariants={childVariants}
                    />
                </motion.div>
            </motion.section>
        </>
    );
};

export default Login;