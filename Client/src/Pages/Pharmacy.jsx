import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../Components/NavBar"

const Pharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [photoUrls, setPhotoUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    requiereReceta: null,
    esAntibiotico: null,
    stock: null,
  });
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://localhost:5000/home/getMedicines');
        if (!response.ok) throw new Error('Error al obtener los medicamentos');
        const data = await response.json();
        setMedicines(data);

        const urls = {};
        data.forEach(medicine => {
          if (medicine.foto.data) {
            const byteArray = new Uint8Array(medicine.foto.data);
            const blob = new Blob([byteArray], { type: medicine.fotoMimeType || 'image/jpeg' });
            urls[medicine.id_medicamento] = URL.createObjectURL(blob);
          }
        });
        setPhotoUrls(urls);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.nombre.toLowerCase().includes(searchFilter.toLowerCase()) ||
      medicine.categoria.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesReceta =
      filterOptions.requiereReceta === null ||
      (medicine.requiere_receta === 1 ? true : medicine.requiere_receta === 0 ? false : medicine.requiere_receta) === filterOptions.requiereReceta;
    const matchesAntibiotico =
      filterOptions.esAntibiotico === null ||
      (medicine.es_antibiotioco === 1 ? true : medicine.es_antibiotioco === 0 ? false : medicine.es_antibiotioco) === filterOptions.esAntibiotico;
    const matchesStock =
      filterOptions.stock === null || (filterOptions.stock ? medicine.stock > 0 : medicine.stock === 0);

    return matchesSearch && matchesReceta && matchesAntibiotico && matchesStock;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: { duration: 15, repeat: Infinity, ease: 'linear' },
    },
  };

  const handleMoreInfoClick = (medicine) => {
    console.log('Medicine selected:', medicine); // Depuración
    setSelectedMedicine(medicine);
    console.log('Selected Medicine State:', selectedMedicine); // Depuración adicional
  };

  const closeModal = () => {
    console.log('Closing modal'); // Depuración
    setSelectedMedicine(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-100">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-red-100 p-6 rounded-xl shadow-lg text-red-700"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <motion.div
        variants={backgroundVariants}
        animate="animate"
        className="min-h-screen py-12 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(45deg, #134e4a, #1e6159, #2c7a74, #1e6159, #134e4a)', // Colores inspirados en OtpScreen
          backgroundSize: '200% 200%',
        }}
      >
        {/* Capa de fondo animada adicional */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,125,128,0.2)_70%)]" />
        </motion.div>

        {/* Elementos decorativos SVG */}
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

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <h2 className="text-5xl font-extrabold text-white mb-10 text-center bg-gradient-to-r from-teal-200 to-teal-400 bg-clip-text text-transparent">
            Farmacia Digital
          </h2>

          <motion.div whileHover={{ scale: 1.02 }} className="relative mb-6">
            <input
              type="text"
              placeholder="Buscar medicamentos por nombre o categoría..."
              className="w-full p-5 pr-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:border-teal-400 transition-all duration-300 text-gray-700 placeholder-gray-400"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <motion.span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500"
              animate={{ scale: searchFilter ? 1.2 : 1 }}
            >
              🔍
            </motion.span>
          </motion.div>

          <div className="flex flex-wrap gap-4 mb-10 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full shadow-md text-sm font-semibold transition-colors ${filterOptions.requiereReceta === null
                  ? 'bg-teal-500 text-white'
                  : filterOptions.requiereReceta
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              onClick={() =>
                setFilterOptions((prev) => ({
                  ...prev,
                  requiereReceta:
                    prev.requiereReceta === null ? true : prev.requiereReceta ? false : null,
                }))
              }
            >
              {filterOptions.requiereReceta === null
                ? 'Todos (Receta)'
                : filterOptions.requiereReceta
                  ? 'Requiere Receta'
                  : 'Sin Receta'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full shadow-md text-sm font-semibold transition-colors ${filterOptions.esAntibiotico === null
                  ? 'bg-teal-500 text-white'
                  : filterOptions.esAntibiotico
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              onClick={() =>
                setFilterOptions((prev) => ({
                  ...prev,
                  esAntibiotico:
                    prev.esAntibiotico === null ? true : prev.esAntibiotico ? false : null,
                }))
              }
            >
              {filterOptions.esAntibiotico === null
                ? 'Todos (Antibiótico)'
                : filterOptions.esAntibiotico
                  ? 'Antibióticos'
                  : 'No Antibióticos'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full shadow-md text-sm font-semibold transition-colors ${filterOptions.stock === null
                  ? 'bg-teal-500 text-white'
                  : filterOptions.stock
                    ? 'bg-teal-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              onClick={() =>
                setFilterOptions((prev) => ({
                  ...prev,
                  stock: prev.stock === null ? true : prev.stock ? false : null,
                }))
              }
            >
              {filterOptions.stock === null
                ? 'Todos (Stock)'
                : filterOptions.stock
                  ? 'En Stock'
                  : 'Sin Stock'}
            </motion.button>
          </div>

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
                  <motion.div
                    key={medicine.id_medicamento}
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-teal-100 hover:border-teal-300 transition-all duration-300 cursor-pointer overflow-hidden relative group"
                  >
                    {medicine.requiere_receta === 1 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        Receta
                      </div>
                    )}

                    {photoUrls[medicine.id_medicamento] ? (
                      <motion.img
                        src={photoUrls[medicine.id_medicamento]}
                        alt={medicine.nombre}
                        className="w-full h-48 object-cover rounded-lg mb-6 group-hover:shadow-inner"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 rounded-lg mb-6">
                        Sin imagen
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-teal-700 mb-2 group-hover:text-teal-600 transition-colors">
                      {medicine.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {medicine.descripcion || 'Sin descripción disponible'}
                    </p>

                    <div className="space-y-2">
                      <p className="text-teal-600 font-bold text-lg">
                        ${Number(medicine.precio).toFixed(2)}
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

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-teal-500 text-white py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                      onClick={() => handleMoreInfoClick(medicine)}
                    >
                      Más Información
                    </motion.button>

                    <motion.div
                      className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Modal simplificado para depuración */}
      {selectedMedicine && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-teal-700 mb-4">{selectedMedicine.nombre}</h3>
            {photoUrls[selectedMedicine.id_medicamento] && (
              <img
                src={photoUrls[selectedMedicine.id_medicamento]}
                alt={selectedMedicine.nombre}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <p className="text-gray-600 mb-4">{selectedMedicine.descripcion || 'Sin descripción disponible'}</p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Precio:</strong> ${Number(selectedMedicine.precio).toFixed(2)}</p>
              <p><strong>Stock:</strong> <span className={selectedMedicine.stock > 0 ? 'text-green-500' : 'text-red-500'}>{selectedMedicine.stock}</span></p>
              <p><strong>Categoría:</strong> {selectedMedicine.categoria}</p>
              <p><strong>Requiere receta:</strong> {selectedMedicine.requiere_receta === 1 ? 'Sí' : 'No'}</p>
              <p><strong>Antibiótico:</strong> {selectedMedicine.es_antibiotioco === 1 ? 'Sí' : 'No'}</p>
            </div>
            <button
              className="mt-6 w-full bg-teal-500 text-white py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pharmacy;