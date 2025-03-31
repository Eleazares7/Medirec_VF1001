// src/Pages/Patients/HomePatient.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import Navbar from "../../Components/HomeComponents/NavBar.jsx";
import Footer from "../../Components/HomeComponents/Footer.jsx";

const HomePatient = () => {
  const { user } = useContext(AuthContext);
  const [patientData, setPatientData] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
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

  if (!patientData) {
    return (
      <>
        <Navbar photoUrl={photoUrl} patientName={user?.nombre} />
        <div className="min-h-screen bg-teal-50 flex items-center justify-center">
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
            <p className="text-teal-800 text-xl font-semibold">Cargando tu experiencia...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar photoUrl={photoUrl} patientName={patientData.nombre} />
      <div className="min-h-screen bg-teal-50 px-6 py-12">
        {/* Hero Section */}
        <section
          className={`max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-10 mb-10 transition-all duration-1000 ease-in-out transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
            }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
              <h1
                className="text-5xl font-bold text-teal-800 mb-4 animate-fade-in-down"
                style={{ animationDelay: "0.2s" }}
              >
                ¡Bienvenido(a), {patientData.nombre}!
              </h1>
              <p
                className="text-xl text-teal-600 mb-6 animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                Tu salud es nuestra prioridad. Explora todo lo que MediRec tiene para ti.
              </p>
              <button
                onClick={() => navigate("/patient/createAppointment")}
                className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-teal-700 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: "0.6s" }}
              >
                Agendar Cita Ahora
              </button>
            </div>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Foto del paciente"
                className="w-40 h-40 rounded-full object-cover border-4 border-teal-300 mt-6 md:mt-0 animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              />
            ) : (
              <div
                className="w-40 h-40 rounded-full bg-teal-200 flex items-center justify-center mt-6 md:mt-0 animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              >
                <span className="text-5xl font-bold text-teal-800">{patientData.nombre?.[0]}</span>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: "Citas Médicas", desc: "Agenda y gestiona tus citas", path: "/patient/manageAppointments", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { title: "Farmacia", desc: "Ordena tus medicamentos", path: "/pharmacy", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-12 0h-2M12 7v6m0 0l-3-3m3 3l3-3" },
            { title: "Historial", desc: "Revisa tu historial de tus acciones", path: "/patient/manageHistorial", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item, index) => (
            <div
              key={item.title}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              <svg
                className="w-12 h-12 text-teal-600 mb-4 mx-auto transform hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <h3 className="text-xl font-semibold text-teal-800 mb-2">{item.title}</h3>
              <p className="text-teal-600 mb-4">{item.desc}</p>
              <button
                onClick={() => navigate(item.path)}
                className="text-teal-700 font-medium hover:text-teal-900 transition-colors duration-300"
              >
                Ir ahora →
              </button>
            </div>
          ))}
        </section>

        {/* Featured Banner */}
        <section
          className="max-w-6xl mx-auto bg-teal-700 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between animate-fade-in"
          style={{ animationDelay: "1.4s" }}
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Tu Salud, Nuestra Misión</h2>
            <p className="text-lg">Accede a servicios médicos de calidad desde la comodidad de tu hogar.</p>
          </div>
          <button
            onClick={() => navigate("/services")}
            className="mt-4 md:mt-0 bg-white text-teal-800 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-teal-100 transform hover:scale-105 transition-all duration-300"
          >
            Descubre Más
          </button>
        </section>

        <Footer />

      </div>
    </>
  );
};

export default HomePatient;

