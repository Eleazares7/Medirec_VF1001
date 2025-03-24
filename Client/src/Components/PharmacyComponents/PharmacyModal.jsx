// components/Pharmacy/PharmacyModal.jsx
import React from 'react';

const PharmacyModal = ({ medicine, photoUrl, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-teal-700 mb-4">{medicine.nombre}</h3>
                {photoUrl && (
                    <img
                        src={photoUrl}
                        alt={medicine.nombre}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                )}
                <p className="text-gray-600 mb-4">{medicine.descripcion || 'Sin descripción disponible'}</p>
                <div className="space-y-2 text-gray-700">
                    <p><strong>Precio:</strong> ${Number(medicine.precio).toFixed(2)}</p>
                    <p><strong>Stock:</strong> <span className={medicine.stock > 0 ? 'text-green-500' : 'text-red-500'}>{medicine.stock}</span></p>
                    <p><strong>Categoría:</strong> {medicine.categoria}</p>
                    <p><strong>Requiere receta:</strong> {medicine.requiere_receta === 1 ? 'Sí' : 'No'}</p>
                    <p><strong>Antibiótico:</strong> {medicine.es_antibiotioco === 1 ? 'Sí' : 'No'}</p>
                </div>
                <button
                    className="mt-6 w-full bg-teal-500 text-white py-2 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default PharmacyModal;