// ServiceCards.jsx
import React from 'react';

const ServiceCards = () => {
  const services = [
    {
      title: 'Citas Médicas',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      description: 'Agenda tu cita con nuestros especialistas en minutos.',
      buttonText: 'Agendar Ahora',
    },
    {
      title: 'Farmacia',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-12 0h-2M12 7v6m0 0l-3-3m3 3l3-3',
      description: 'Encuentra todos tus medicamentos en un solo lugar.',
      buttonText: 'Ver Catálogo',
    },
    {
      title: 'Beneficios',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      description: 'Disfruta de descuentos y atención preferencial.',
      buttonText: 'Conoce Más',
    },
  ];

  return (
    <div className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-12">
      {services.map((service, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={service.icon} />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">{service.title}</h2>
          </div>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-300">
            {service.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ServiceCards;