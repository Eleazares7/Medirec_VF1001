// RegisterPatient.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash, FaQuestionCircle } from 'react-icons/fa';
import Navbar from '../../Components/NavBar';

const RegisterPatient = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    edad: '',
    fechaNacimiento: '',
    direccion: '',
    calle: '',
    numeroExterior: '',
    entreCalle1: '',
    entreCalle2: '',
    codigoPostal: '',
    asentamiento: '',
    municipio: '',
    estado: '',
    pais: 'México',
    alergias: '',
    antecedentes_medicos: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
    foto: null,
  });
  const [previewFoto, setPreviewFoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [colonias, setColonias] = useState([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'codigoPostal' && value.length === 5) {
      try {
        const response = await fetch(`http://localhost:5000/api/codigo-postal/${value}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.error) {
          const { codigo_postal } = data;
          setColonias(codigo_postal.colonias || []);
          
          setFormData((prevData) => ({
            ...prevData,
            asentamiento: codigo_postal.colonias.length > 0 ? codigo_postal.colonias[0] : '',
            municipio: codigo_postal.municipio || '',
            estado: codigo_postal.estado || '',
            pais: 'México',
          }));
          setApiError(null);
        } else {
          setColonias([]);
          setApiError(data.message);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud al backend:', error);
        setColonias([]);
        setApiError(error.message || 'No se pudo obtener la información del código postal.');
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/api/register-patient', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setFormData({
          nombre: '',
          telefono: '',
          edad: '',
          fechaNacimiento: '',
          direccion: '',
          calle: '',
          numeroExterior: '',
          entreCalle1: '',
          entreCalle2: '',
          codigoPostal: '',
          asentamiento: '',
          municipio: '',
          estado: '',
          pais: 'México',
          alergias: '',
          antecedentes_medicos: '',
          email: '',
          contrasena: '',
          confirmarContrasena: '',
          foto: null,
        });
        setPreviewFoto(null);
        setColonias([]);
        setStep(1);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al registrar el paciente');
    }
  };

  const showPasswordRequirements = () => {
    Swal.fire({
      title: 'Requisitos de Contraseña',
      html: `
        <ul style="text-align: left; color: #0f766e;">
          <li>Mínimo 8 caracteres</li>
          <li>Al menos una letra mayúscula</li>
          <li>Al menos un número</li>
          <li>Al menos un carácter especial (ej. !@#)</li>
        </ul>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      customClass: {
        popup: 'bg-teal-50 rounded-lg shadow-lg',
        title: 'text-2xl font-bold text-teal-800',
        confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
      },
    });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.3 },
    },
  };

  // Variantes ajustadas para una transición más fluida
  const childVariants = {
    hidden: { opacity: 0, x: 50 }, // Reducimos el desplazamiento de 100 a 50
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.7, // Aumentamos la duración para suavidad
        ease: 'easeInOut', // Usamos easeInOut para un movimiento más natural
      } 
    },
    exit: { 
      opacity: 0, 
      x: -50, // Reducimos el desplazamiento de salida
      transition: { 
        duration: 0.7, 
        ease: 'easeInOut' 
      } 
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
        animate={isVisible ? 'visible' : 'hidden'}
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

        <motion.div className="container mx-auto px-6 py-16 flex flex-col items-center z-10" variants={containerVariants}>
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
            variants={childVariants}
          >
            Registro de Paciente - Paso {step} de 4
          </motion.h1>

          <motion.form
            className="w-full max-w-xl bg-white text-teal-800 p-8 rounded-2xl shadow-xl border border-teal-200"
            onSubmit={handleSubmit}
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={childVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      id="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="edad">Edad</label>
                    <input
                      type="number"
                      name="edad"
                      id="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      id="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={childVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="direccion">Dirección</label>
                    <textarea
                      name="direccion"
                      id="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows="3"
                    />
                  </motion.div>
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="calle">Calle</label>
                    <input
                      type="text"
                      name="calle"
                      id="calle"
                      value={formData.calle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="numeroExterior">No. Exterior</label>
                    <input
                      type="text"
                      name="numeroExterior"
                      id="numeroExterior"
                      value={formData.numeroExterior}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="entreCalle1">Entre Calle 1</label>
                    <input
                      type="text"
                      name="entreCalle1"
                      id="entreCalle1"
                      value={formData.entreCalle1}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="entreCalle2">Entre Calle 2</label>
                    <input
                      type="text"
                      name="entreCalle2"
                      id="entreCalle2"
                      value={formData.entreCalle2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </motion.div>
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="codigoPostal">Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      id="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      maxLength="5"
                      required
                    />
                    {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
                  </motion.div>
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="asentamiento">Asentamiento</label>
                    {colonias.length > 0 ? (
                      <select
                        name="asentamiento"
                        id="asentamiento"
                        value={formData.asentamiento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {colonias.map((colonia, index) => (
                          <option key={index} value={colonia}>{colonia}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="asentamiento"
                        id="asentamiento"
                        value={formData.asentamiento}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        readOnly
                      />
                    )}
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="municipio">Municipio</label>
                    <input
                      type="text"
                      name="municipio"
                      id="municipio"
                      value={formData.municipio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      readOnly
                    />
                  </motion.div>
                  <motion.div variants={childVariants}>
                    <label className="block text-sm font-medium mb-2" htmlFor="estado">Estado</label>
                    <input
                      type="text"
                      name="estado"
                      id="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      readOnly
                    />
                  </motion.div>
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="pais">País</label>
                    <input
                      type="text"
                      name="pais"
                      id="pais"
                      value={formData.pais}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      readOnly
                    />
                  </motion.div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={childVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="alergias">Alergias</label>
                    <textarea
                      name="alergias"
                      id="alergias"
                      value={formData.alergias}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows="3"
                    />
                  </motion.div>
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="antecedentes_medicos">Antecedentes Médicos</label>
                    <textarea
                      name="antecedentes_medicos"
                      id="antecedentes_medicos"
                      value={formData.antecedentes_medicos}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows="3"
                    />
                  </motion.div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={childVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
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
                  <motion.div variants={childVariants} className="md:col-span-2 relative">
                    <label className="block text-sm font-medium mb-2" htmlFor="contrasena">Contraseña</label>
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
                      <button
                        type="button"
                        onClick={showPasswordRequirements}
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
                      >
                        <FaQuestionCircle />
                      </button>
                    </div>
                  </motion.div>
                  <motion.div variants={childVariants} className="md:col-span-2 relative">
                    <label className="block text-sm font-medium mb-2" htmlFor="confirmarContrasena">Confirmar Contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmarContrasena"
                        id="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-800"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </motion.div>
                  <motion.div variants={childVariants} className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" htmlFor="foto">Foto de Perfil</label>
                    <div
                      {...getRootProps()}
                      className={`w-full px-4 py-6 border-2 border-dashed border-teal-300 rounded-lg text-center cursor-pointer
                        ${isDragActive ? 'bg-teal-100' : 'bg-white'} hover:bg-teal-50 transition-all duration-300`}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p className="text-teal-800">Suelta la imagen aquí...</p>
                      ) : (
                        <p className="text-teal-800">Arrastra una imagen o haz clic para seleccionar</p>
                      )}
                    </div>
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
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Anterior
                </motion.button>
              )}
              {step < 4 && (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg ml-auto"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Siguiente
                </motion.button>
              )}
              {step === 4 && (
                <motion.button
                  type="submit"
                  className="bg-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg flex items-center ml-auto"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  animate="pulse"
                >
                  Registrar Paciente
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
              )}
            </div>
          </motion.form>
        </motion.div>
      </motion.section>
    </>
  );
};

export default RegisterPatient;