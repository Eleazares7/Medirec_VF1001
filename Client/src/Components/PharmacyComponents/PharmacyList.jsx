// components/Pharmacy/PharmacyList.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PharmacyCard from './PharmacyCard';

const PharmacyList = ({ filteredMedicines, photoUrls, handleMoreInfoClick, addToCart }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <AnimatePresence>
      {filteredMedicines.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center text-gray-200 text-lg italic"
        >
          No se encontraron medicamentos.
        </motion.p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredMedicines.map((medicine) => (
            <PharmacyCard
              key={medicine.id_medicamento}
              medicine={medicine}
              photoUrl={photoUrls[medicine.id_medicamento]}
              onMoreInfoClick={handleMoreInfoClick}
              addToCart={addToCart} // Pasar la función
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PharmacyList;