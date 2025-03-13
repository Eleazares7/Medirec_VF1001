// SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Buscando:', searchTerm);
        // Aquí puedes agregar tu lógica de búsqueda
    };

    return (
        <div className="w-full max-w-xl mx-auto py-8">
            <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                    {/* Icono de búsqueda */}
                    <div
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-blue-600' : 'text-gray-400'
                            }`}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Busca medicamentos, citas o servicios..."
                        className={`w-full pl-12 pr-24 py-3 rounded-full border-2 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-200
              transition-all duration-300 ease-in-out
              ${isFocused
                                ? 'border-blue-500 shadow-md scale-[1.02]'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                    />

                    {/* Botón de búsqueda */}
                    <button
                        type="submit"
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2
              bg-blue-600 text-white px-4 py-1.5 rounded-full
              transition-all duration-300 ease-in-out
              hover:bg-blue-700 focus:outline-none
              ${isFocused ? 'shadow-lg scale-105' : 'shadow-md'}`}
                    >
                        <span className="flex items-center">
                            Buscar
                            <svg
                                className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Línea de animación debajo */}
                <div
                    className={`h-0.5 bg-blue-500 absolute bottom-0 left-0 transition-all duration-300
            ${isFocused ? 'w-full' : 'w-0'}`}
                />
            </form>

            {/* Sugerencias (opcional) */}
            {isFocused && searchTerm && (
                <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-100
          animate-fadeIn max-h-64 overflow-y-auto">
                    <ul className="py-2">
                        {['Cita médica', 'Farmacia', 'Medicamentos', 'Consulta general']
                            .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                                    onClick={() => {
                                        setSearchTerm(suggestion);
                                        setIsFocused(false);
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Estilos personalizados
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
`;

export default SearchBar;