// components/Pharmacy/PharmacyFilters.jsx
import React from 'react';
import { motion } from 'framer-motion';

const PharmacyFilters = ({ filterOptions, setFilterOptions, searchFilter, setSearchFilter }) => {
    return (
        <>
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

                {/* Otros botones de filtro similares... */}
            </div>
        </>
    );
};

export default PharmacyFilters;