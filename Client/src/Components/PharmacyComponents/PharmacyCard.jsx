// components/Pharmacy/PharmacyCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const PharmacyCard = ({ medicine, photoUrl, onMoreInfoClick, addToCart }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-teal-100 transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {medicine.requiere_receta === 1 && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          Receta
        </div>
      )}

      {photoUrl ? (
        <motion.img
          src={photoUrl}
          alt={medicine.nombre}
          className="w-full h-48 object-cover rounded-lg mb-6"
          transition={{ duration: 0.3 }}
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 rounded-lg mb-6">
          Sin imagen
        </div>
      )}

      <h3 className="text-xl font-bold text-teal-700 mb-2 transition-colors">
        {medicine.nombre}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {medicine.descripcion || 'Sin descripción disponible'}
      </p>

      <div className="space-y-2">
        <p className="text-teal-600 font-bold text-lg">
          ${Number(medicine.precio).toFixed(2)} MXN
        </p>
        <p className="text-gray-500 text-sm">
          Stock: <span className={medicine.stock > 0 ? 'text-green-500' : 'text-red-500'}>
            {medicine.stock}
          </span>
        </p>
        <p className="text-gray-500 text-sm">Categoría: {medicine.categoria}</p>
        <p className="text-gray-500 text-sm">
          {medicine.requiere_receta === 1 ? 'Requiere receta' : 'Sin receta'}
        </p>
        <p className="text-gray-500 text-sm">
          {medicine.es_antibiotioco === 1 ? 'Antibiótico' : 'No es antibiótico'}
        </p>
      </div>

      <div className="flex space-x-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-teal-500 text-white py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
          onClick={() => onMoreInfoClick(medicine)}
        >
          Más Información
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition-colors"
          onClick={() => addToCart(medicine)}
        >
          Agregar al Carrito
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PharmacyCard;