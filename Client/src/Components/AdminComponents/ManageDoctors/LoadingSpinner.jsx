import React from 'react';
import NavbarAdmin from '../HomeAdmin/NavBarAdmin.jsx'

const LoadingSpinner = () => (
    <>
        <NavbarAdmin />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="flex items-center space-x-3">
                <svg
                    className="animate-spin h-10 w-10 text-teal-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <p className="text-teal-800 text-xl font-semibold">Cargando lista de doctores...</p>
            </div>
        </div>
    </>
);

export default LoadingSpinner;