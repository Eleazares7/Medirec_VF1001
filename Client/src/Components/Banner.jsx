// Banner.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Importamos framer-motion
import Persona1 from '../Images/Persona1.jpg';
import Persona2 from '../Images/Persona2.png';
import Persona3 from '../Images/Persona3.jpg';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      name: 'María González',
      comment: 'Excelente atención, me atendieron rápido y con profesionalismo.',
      image: Persona2,
    },
    {
      name: 'Juan Pérez',
      comment: 'Las consultas son muy accesibles y el personal es amable.',
      image: Persona1,
    },
    {
      name: 'Ana Martínez',
      comment: 'Recomiendo ampliamente sus servicios médicos.',
      image: Persona3,
    },
  ];

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.3 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Infinity } },
  };

  return (
    <motion.section
      className="w-full min-h-screen bg-teal-800 text-white flex items-center justify-center relative overflow-hidden"
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Fondo animado */}
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

      {/* Contenido principal */}
      <motion.div className="container mx-auto px-6 py-16 flex flex-col items-center z-10" variants={containerVariants}>
        <motion.div className="text-center mb-8" variants={childVariants}>
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ scale: 0.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Tu Salud es Nuestra Prioridad
          </motion.h1>
          <motion.p
            className="text-teal-100 text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Descubre consultas médicas de calidad con profesionales dedicados. 
            Agenda hoy y únete a miles de pacientes satisfechos.
          </motion.p>
          <motion.button
            className="bg-white text-teal-800 px-8 py-4 rounded-full font-semibold text-lg shadow-lg flex items-center mx-auto"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            animate="pulse"
          >
            Agendar Consulta
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
        </motion.div>

        <motion.div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl" variants={containerVariants}>
          {testimonials.map((user, index) => (
            <motion.div
              key={index}
              className="bg-white text-teal-800 p-6 rounded-2xl shadow-xl border border-teal-200"
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.3 }}
            >
              <motion.img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-teal-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <motion.p className="text-gray-700 text-sm italic text-center mb-3" variants={childVariants}>
                "{user.comment}"
              </motion.p>
              <motion.p className="text-teal-800 font-semibold text-center" variants={childVariants}>
                {user.name}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-4xl" variants={containerVariants}>
          {[
            { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Citas en 24 horas' },
            { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Precios accesibles' },
            { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Atención garantizada' },
          ].map((item, index) => (
            <motion.div key={index} variants={childVariants} transition={{ delay: index * 0.2 + 0.6 }}>
              <motion.svg
                className="w-12 h-12 mx-auto mb-4 text-teal-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </motion.svg>
              <p className="text-teal-100 font-medium">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Banner;