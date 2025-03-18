// MedicalReportsSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaChartLine, FaUserMd, FaDollarSign } from 'react-icons/fa';
import Navbar from '../Components/NavBar';
import ReportCard from '../Components/ReportCardComponents/ReportCard';
import AnimatedBackground from '../Components/ReportCardComponents/Animatedbackground.jsx';
import variants from '../Utils/animations.js';

const [containerVariantsMedicalReport, titleVariants, cardVariants, iconVariants] = variants;

const MedicalReportsSection = () => {
  
    const reports = [
    { id: 1, title: 'Informe de Consulta General', description: 'Obtén un resumen detallado de tu consulta médica para tu tranquilidad.', price: '$99', icon: FaFileAlt },
    { title: 'Informe de Análisis Clínico', description: 'Recibe tus resultados de laboratorio explicados de forma sencilla.', price: '$149', icon: FaChartLine },
    { title: 'Informe de Seguimiento Especialista', description: 'Mantén un registro de tu progreso con especialistas, ¡fácil y accesible!', price: '$199', icon: FaUserMd },
    { title: 'Factura de Consulta Virtual', description: 'Descarga tu recibo y factura de citas online en un solo clic.', price: '$99', icon: FaDollarSign },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.section
        className="w-full flex-1 bg-[#006D77] text-white flex flex-col items-center relative overflow-hidden pt-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariantsMedicalReport}
      >
        <AnimatedBackground />
        
        <motion.div className="text-center mb-4 z-10" variants={titleVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Mantén el Control de tu Salud con Nuestros Informes
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white mt-4">
            Accede a tus informes médicos desde solo $99 pesos. ¡Todo lo que necesitas para tu tranquilidad en un solo lugar!
          </p>
        </motion.div>

        <div className="container mx-auto px-6 z-10 flex-1 w-full flex items-center justify-center">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full h-full"
            variants={containerVariantsMedicalReport}
          >
            {reports.map((report, index) => (
              <ReportCard 
                key={index} 
                report={report} 
                index={index} 
                cardVariants={cardVariants} 
                iconVariants={iconVariants} 
              />
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default MedicalReportsSection;