import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

import Navbar from "../../Components/NavBar.jsx";
import Step1 from "../../Components/RegisterPatient/Step1.jsx";
import Step2 from "../../Components/RegisterPatient/Step2.jsx";
import Step3 from "../../Components/RegisterPatient/Step3.jsx";
import Step4 from "../../Components/RegisterPatient/Step4.jsx";
import NavigationButtons from "../../Components/RegisterPatient/NavigationButtons.jsx";
import RegisterAnimatedObjects from "../../Components/RegisterPatient/registerAnimatedObjects.jsx";
import variants from "../../Utils/animations.js";
import * as handlers from "../../Utils/RegisterPatient/formHandlers.js"; // Importamos todo como un objeto

const RegisterPatient = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        fechaNacimiento: "",
        calle: "",
        numeroExterior: "",
        entreCalle1: "",
        entreCalle2: "",
        codigoPostal: "",
        asentamiento: "",
        municipio: "",
        estado: "",
        pais: "México",
        alergias: "",
        antecedentes_medicos: "",
        email: "",
        contrasena: "",
        confirmarContrasena: "",
        foto: null,
    });
    const [previewFoto, setPreviewFoto] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [colonias, setColonias] = useState([]);


    const { childVariants, containerVariants, buttonVariants } = variants;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFormData({ ...formData, foto: file });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewFoto(reader.result);
                };
                reader.readAsDataURL(file);
            }
        },
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    // Creamos versiones locales de handleChange y handleSubmit que pasen los estados necesarios
    const localHandleChange = (e) =>
        handlers.handleChange(e, formData, setFormData, setColonias, setApiError);
    const localHandleSubmit = (e) => handlers.handleSubmit(e, formData, navigate);

    return (
        <>
            <Navbar />
            <motion.section
                className="w-full min-h-screen bg-teal-800 text-white flex items-center justify-center relative overflow-hidden"
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <RegisterAnimatedObjects />
                <motion.div
                    className="container mx-auto px-6 py-16 flex flex-col items-center z-10"
                    variants={containerVariants}
                >
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-6 text-center"
                        variants={childVariants}
                    >
                        Registro de Paciente - Paso {step} de 4
                    </motion.h1>
                    <motion.form
                        className="w-full max-w-xl bg-white text-teal-800 p-8 rounded-2xl shadow-xl border border-teal-200"
                        onSubmit={localHandleSubmit}
                        variants={containerVariants}
                    >
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <Step1
                                    formData={formData}
                                    handleChange={localHandleChange}
                                    childVariants={childVariants}
                                />
                            )}
                            {step === 2 && (
                                <Step2
                                    formData={formData}
                                    handleChange={localHandleChange}
                                    childVariants={childVariants}
                                    colonias={colonias}
                                    apiError={apiError}
                                />
                            )}
                            {step === 3 && (
                                <Step3
                                    formData={formData}
                                    handleChange={localHandleChange}
                                    childVariants={childVariants}
                                />
                            )}
                            {step === 4 && (
                                <Step4
                                    formData={formData}
                                    handleChange={localHandleChange}
                                    childVariants={childVariants}
                                    previewFoto={previewFoto}
                                    getRootProps={getRootProps}
                                    getInputProps={getInputProps}
                                    isDragActive={isDragActive}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    showConfirmPassword={showConfirmPassword}
                                    setShowConfirmPassword={setShowConfirmPassword}
                                />
                            )}
                        </AnimatePresence>
                        <NavigationButtons
                            step={step}
                            prevStep={prevStep}
                            nextStep={nextStep}
                            buttonVariants={buttonVariants}
                        />
                    </motion.form>
                </motion.div>
            </motion.section>
        </>
    );
};

export default RegisterPatient;