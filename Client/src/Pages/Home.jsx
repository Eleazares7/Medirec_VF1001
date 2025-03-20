import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../Components/NavBar'

import { motion } from 'framer-motion';
import variants from '../Utils/animations.js';
import BackgroundAnimation from '../Components/HomeComponents/BackgroundAnimation.jsx';
import TestimonialCard from '../Components/HomeComponents/TestimonialCard.jsx';
import FeatureItem from '../Components/HomeComponents/FeatureItem.jsx';
import Image1 from '../Images/Persona1.jpg';
import Image2 from '../Images/Persona2.png';
import Image3 from '../Images/Persona3.jpg';

import { AuthContext } from "../Context/AuthContext.jsx";
const [childVariants, containerVariants, buttonVariants] = variants;

const testimonialsData = [
  {
    name: 'María González',
    comment: 'Excelente atención, me atendieron rápido y con profesionalismo.',
    image: Image2,
  },
  {
    name: 'Juan Pérez',
    comment: 'Las consultas son muy accesibles y el personal es amable.',
    image: Image1,
  },
  {
    name: 'Ana Martínez',
    comment: 'Recomiendo ampliamente sus servicios médicos.',
    image: Image3,
  },
];

const featuresData = [
  { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Citas en 24 horas' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Precios accesibles' },
  { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Atención garantizada' },
];

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  // const { user, logout } = useContext(AuthContext);  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // console.log(user)




  return (
    <>
      <Navbar />
      <motion.section
        className="w-full min-h-screen bg-teal-800 text-white flex items-center justify-center relative overflow-hidden"
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <BackgroundAnimation />

        <motion.div className="container mx-auto px-6 py-16 flex flex-col items-center z-10" variants={containerVariants}>
          <HeaderContent />
          <Testimonials testimonials={testimonialsData} />
          <Features features={featuresData} />
        </motion.div>
      </motion.section>
    </>
  );
}

// Componente para el contenido del encabezado
const HeaderContent = () => (
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
      <a href="/registerPatient">Agendar Consulta</a>
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
);

// Componente para los testimonios
const Testimonials = ({ testimonials }) => (
  <motion.div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl" variants={containerVariants}>
    {testimonials.map((user, index) => (
      <TestimonialCard key={index} user={user} index={index} />
    ))}
  </motion.div>
);

// Componente para las características
const Features = ({ features }) => (
  <motion.div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-4xl" variants={containerVariants}>
    {features.map((item, index) => (
      <FeatureItem key={index} item={item} index={index} />
    ))}
  </motion.div>
);


export default Home
