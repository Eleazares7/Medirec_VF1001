import React from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaQuestionCircle } from "react-icons/fa";
import showPasswordRequirements from "../../Utils/RegisterPatient/modals.js";

const Step4 = ({
  formData,
  handleChange,
  childVariants,
  previewFoto,
  getRootProps,
  getInputProps,
  isDragActive,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword
}) => {
  return (
    <motion.div
      key="step4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={childVariants}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <motion.div variants={childVariants} className="md:col-span-2">
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

      <motion.div variants={childVariants} className="md:col-span-2 relative">
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
        <label
          className="block text-sm font-medium mb-2"
          htmlFor="confirmarContrasena"
        >
          Confirmar Contraseña
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
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
        <label className="block text-sm font-medium mb-2" htmlFor="foto">
          Foto de Perfil
        </label>
        <div
          {...getRootProps()}
          className={`w-full px-4 py-6 border-2 border-dashed border-teal-300 rounded-lg text-center cursor-pointer
            ${isDragActive ? "bg-teal-100" : "bg-white"} hover:bg-teal-50 transition-all duration-300`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-teal-800">Suelta la imagen aquí...</p>
          ) : (
            <p className="text-teal-800">
              Arrastra una imagen o haz clic para seleccionar
            </p>
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
  );
};

export default Step4;