import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import Navbar from "../../Components/HomeComponents/NavBar.jsx";
import Footer from "../../Components/HomeComponents/Footer.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [patientData, setPatientData] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [photoUrl, setPhotoUrl] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!user || !user.email) {
                navigate("/login");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/users/patient/${user.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener los datos del paciente: ${response.statusText}`);
                }

                const data = await response.json();
                setPatientData(data);
                setEditedData(data); // Initialize editable data

                if (data.fotoData && data.fotoData.data) {
                    const byteArray = new Uint8Array(data.fotoData.data);
                    const blob = new Blob([byteArray], { type: data.fotoMimeType || "image/jpeg" });
                    const url = URL.createObjectURL(blob);
                    setPhotoUrl(url);
                }
            } catch (error) {
                console.error("Error al cargar los datos del paciente:", error);
            }
        };

        fetchPatientData();
    }, [user, navigate]);

    useEffect(() => {
        if (patientData) {
            setIsVisible(true);
        }
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [patientData, photoUrl]);

    const handleInputChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/users/patient/${user.email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedData),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar los datos");
            }

            const updatedData = await response.json();
            setPatientData(updatedData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
        }
    };

    if (!patientData) {
        return (
            <>
                <Navbar photoUrl={photoUrl} patientName={user?.nombre} />
                <div className="min-h-screen bg-teal-50 flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                        <svg className="animate-spin h-10 w-10 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <p className="text-teal-800 text-xl font-semibold">Cargando tu perfil...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar photoUrl={photoUrl} patientName={patientData.nombre} />
            <div className="min-h-screen bg-teal-50 py-12 px-6">
                <section className={`max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 transition-all duration-1000 ease-in-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-bold text-teal-800 text-center animate-fade-in-down" style={{ animationDelay: "0.2s" }}>
                            Tu Perfil
                        </h1>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center text-teal-600 hover:text-teal-800">
                                <PencilIcon className="h-5 w-5 mr-1" /> Editar
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button onClick={handleSubmit} className="flex items-center text-green-600 hover:text-green-800">
                                    <CheckIcon className="h-5 w-5 mr-1" /> Guardar
                                </button>
                                <button onClick={() => { setIsEditing(false); setEditedData(patientData); }} className="flex items-center text-red-600 hover:text-red-800">
                                    <XMarkIcon className="h-5 w-5 mr-1" /> Cancelar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="Foto del paciente" className="w-32 h-32 rounded-full object-cover border-4 border-teal-300 transform hover:scale-105 transition-transform duration-300" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-teal-200 flex items-center justify-center">
                                <span className="text-4xl font-bold text-teal-800">{patientData.nombre?.[0]}</span>
                            </div>
                        )}
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                            <label className="block text-teal-700 font-semibold mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                value={editedData.nombre || ""}
                                onChange={(e) => handleInputChange("nombre", e.target.value)}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-2 rounded-lg border border-teal-300 focus:outline-none ${isEditing ? "bg-white" : "bg-teal-50 text-teal-800"}`}
                            />
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
                            <label className="block text-teal-700 font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                value={editedData.email || ""}
                                readOnly
                                className="w-full px-4 py-2 bg-teal-50 text-teal-800 rounded-lg border border-teal-300 focus:outline-none"
                            />
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                            <label className="block text-teal-700 font-semibold mb-1">Teléfono</label>
                            <input
                                type="text"
                                value={editedData.telefono || ""}
                                onChange={(e) => handleInputChange("telefono", e.target.value)}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-2 rounded-lg border border-teal-300 focus:outline-none ${isEditing ? "bg-white" : "bg-teal-50 text-teal-800"}`}
                            />
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: "0.9s" }}>
                            <label className="block text-teal-700 font-semibold mb-1">Fecha de Nacimiento</label>
                            {isEditing ? (
                                <DatePicker
                                    selected={editedData.fechaNacimiento ? new Date(editedData.fechaNacimiento) : null}
                                    onChange={(date) => handleInputChange("fechaNacimiento", date.toISOString())}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full px-4 py-2 rounded-lg border border-teal-300 focus:outline-none"
                                    placeholderText="Selecciona una fecha"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={editedData.fechaNacimiento ? new Date(editedData.fechaNacimiento).toLocaleDateString() : "No disponible"}
                                    readOnly
                                    className="w-full px-4 py-2 bg-teal-50 text-teal-800 rounded-lg border border-teal-300 focus:outline-none"
                                />
                            )}
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: "1.0s" }}>
                            <label className="block text-teal-700 font-semibold mb-1">Dirección</label>
                            <textarea
                                value={
                                    editedData.calle && editedData.numeroExterior
                                        ? `${editedData.calle} ${editedData.numeroExterior}, ${editedData.asentamiento}, ${editedData.municipio}, ${editedData.estado}, ${editedData.pais}`
                                        : ""
                                }
                                onChange={(e) => {
                                    const [calle, rest] = e.target.value.split(",");
                                    handleInputChange("calle", calle?.trim());
                                    handleInputChange("asentamiento", rest?.trim());
                                }}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-2 rounded-lg border border-teal-300 focus:outline-none resize-none h-24 ${isEditing ? "bg-white" : "bg-teal-50 text-teal-800"}`}
                            />
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: "1.1s" }}>
                            <label className="block text-teal-700 font-semibold mb-1">Alergias</label>
                            <textarea
                                value={editedData.alergias || ""}
                                onChange={(e) => handleInputChange("alergias", e.target.value)}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-2 rounded-lg border border-teal-300 focus:outline-none resize-none h-24 ${isEditing ? "bg-white" : "bg-teal-50 text-teal-800"}`}
                            />
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
                            <label className="block text-teal-700 font-semibold mb-1">Antecedentes Médicos</label>
                            <textarea
                                value={editedData.antecedentes_medicos || ""}
                                onChange={(e) => handleInputChange("antecedentes_medicos", e.target.value)}
                                readOnly={!isEditing}
                                className={`w-full px-4 py-2 rounded-lg border border-teal-300 focus:outline-none resize-none h-24 ${isEditing ? "bg-white" : "bg-teal-50 text-teal-800"}`}
                            />
                        </div>
                    </form>

                    <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "1.3s" }}>
                        <button
                            onClick={() => navigate("/patient/home")}
                            className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-teal-700 transform hover:scale-105 transition-all duration-300"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Profile;