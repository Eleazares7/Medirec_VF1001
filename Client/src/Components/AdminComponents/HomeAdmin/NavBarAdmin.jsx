import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext'; // Asegúrate de que la ruta sea correcta

const NavbarAdmin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [adminData, setAdminData] = useState(null); // Estado para los datos del administrador
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const { user } = useContext(AuthContext); // Obtenemos el usuario del contexto
    const navigate = useNavigate();

    // Animación de entrada al montar el componente
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Petición al backend para obtener los datos del administrador
    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user || !user.email) {
                navigate("/login");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/admin/getAdmin/${user.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener datos del admin: ${response.statusText}`);
                }

                const data = await response.json();
                setAdminData(data);
            } catch (error) {
                console.error("Error al cargar los datos del administrador:", error);
                navigate("/login"); // Redirige al login si hay un error (por ejemplo, token inválido)
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchAdminData();
    }, [user, navigate]);

    const navItems = [
        { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-10l2 2', url: "/admin/home" },
        { name: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197', url: "/admin/manageUsers" },
        { name: 'Reportes', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', url: "/admin/reports" },
        { name: 'Configuración', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z', url: "/admin/settings" },
    ];

    return (
        <nav
            className={`bg-teal-800 text-white shadow-lg transition-all duration-700 ease-in-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/admin/home">
                            <span className="text-2xl font-bold tracking-tight transform hover:scale-105 transition-transform duration-300">
                                Admin Panel
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu - Centrado */}
                    <div className="hidden md:flex flex-1 justify-center items-center">
                        <div className="flex space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.url}
                                    className="group px-4 py-2 flex items-center text-sm font-medium rounded-md
                                    hover:bg-teal-700 hover:text-teal-100 transition-all duration-300"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d={item.icon}
                                        />
                                    </svg>
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Admin Name and Logout Button - A la derecha */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Nombre del administrador */}
                        <span className="text-sm font-medium text-teal-100">
                            {loading ? "Cargando..." : (adminData ? `${adminData.nombre} ${adminData.apellido}` : "Administrador")}
                        </span>
                        <button
                            className="px-4 py-2 bg-teal-600 text-white rounded-full font-medium
                            hover:bg-teal-500 transform hover:scale-105 transition-all duration-300
                            shadow-md hover:shadow-lg"
                        >
                            <span className="flex items-center">
                                Cerrar Sesión
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md
                            text-teal-200 hover:text-white hover:bg-teal-700 focus:outline-none
                            transition-all duration-300"
                        >
                            <span className="sr-only">Abrir menú</span>
                            <svg
                                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <svg
                                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-2">
                        {/* Nombre del administrador en el menú móvil */}
                        <div className="px-3 py-2 text-sm font-medium text-teal-100">
                            {loading ? "Cargando..." : (adminData ? `${adminData.nombre} ${adminData.apellido}` : "Administrador")}
                        </div>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.url}
                                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md
                                hover:bg-teal-700 hover:text-teal-100 transition-all duration-300"
                            >
                                <svg
                                    className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={item.icon}
                                    />
                                </svg>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                        <button
                            className="w-full px-4 py-2 bg-teal-600 text-white rounded-full font-medium
                            hover:bg-teal-500 transform hover:scale-105 transition-all duration-300
                            shadow-md hover:shadow-lg"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarAdmin;