// src/Pages/Patients/HomePatient.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import Navbar from "../../Components/NavBar";

const HomePatient = () => {
  const { user, logout } = useContext(AuthContext);
  const [patientData, setPatientData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const navigate = useNavigate();

  console.log("HOME PATIENT");
  console.log("Usuario desde AuthContext:", user);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user || !user.email) {
        console.log("No hay usuario o email, redirigiendo...");
        navigate("/login");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/users/patient/${user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Agrega el token para autenticación
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener los datos del paciente: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Datos recibidos del backend:", data);
        setPatientData(data);

        // Manejar la foto como un Buffer (BLOB)
        if (data.foto) {
          // El campo foto es un Buffer desde la base de datos
          const blob = new Blob([data.foto], { type: "image/jpeg" }); // Ajusta el tipo si es necesario
          const url = URL.createObjectURL(blob);
          console.log("URL de la foto generada:", url);
          setPhotoUrl(url);
        } else {
          console.log("No hay foto en los datos recibidos");
        }
      } catch (error) {
        console.error("Error al cargar los datos del paciente:", error);
      }
    };

    fetchPatientData();
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
        console.log("URL de la foto liberada");
      }
    };
  }, [photoUrl]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!patientData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-teal-50 flex items-center justify-center">
          <p className="text-teal-800">Cargando datos del paciente...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-teal-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-teal-800 mb-6">
            Bienvenido, {patientData.nombre || user.email}
          </h1>

          {/* Mostrar la foto del paciente */}
          {photoUrl ? (
            <div className="mb-6">
              <img
                src={photoUrl}
                alt="Foto del paciente"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-300 mx-auto"
                onError={(e) => console.error("Error al cargar la imagen:", e)}
              />
            </div>
          ) : (
            <p className="text-teal-700 mb-6">No hay foto disponible</p>
          )}

          {/* Mostrar todos los datos del paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-teal-700 font-semibold">Email:</p>
              <p>{patientData.email || user.email}</p>
            </div>
            <div>
              <p className="text-teal-700 font-semibold">Teléfono:</p>
              <p>{patientData.telefono || "No disponible"}</p>
            </div>
            <div>
              <p className="text-teal-700 font-semibold">Fecha de Nacimiento:</p>
              <p>{patientData.fechaNacimiento || "No disponible"}</p>
            </div>
            <div>
              <p className="text-teal-700 font-semibold">Dirección:</p>
              <p>
                {patientData.calle && patientData.numeroExterior
                  ? `${patientData.calle} ${patientData.numeroExterior}, ${patientData.asentamiento}, ${patientData.municipio}, ${patientData.estado}, ${patientData.pais}`
                  : "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-teal-700 font-semibold">Alergias:</p>
              <p>{patientData.alergias || "No especificadas"}</p>
            </div>
            <div>
              <p className="text-teal-700 font-semibold">Antecedentes Médicos:</p>
              <p>{patientData.antecedentes_medicos || "No especificados"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-teal-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePatient;