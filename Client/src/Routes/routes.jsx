// src/Routes/routes.jsx
import Home from "../Pages/Home";
import ServicesSection from "../Pages/Services";
import MedicalReportsSection from "../Pages/MedicalReportSession";
import RegisterPatient from "../Pages/Patients/RegisterPatient";
import Login from "../Pages/Login";
import OtpScreen from "../Pages/OtpScreen";
import HomePatient from "../Pages/Patients/HomePatient";
import ProtectedRoute from "../Routes/ProtectedRoute.jsx";

export const routes = [
    { path: "/", element: <Home />, index: true },
    { path: "/services", element: <ServicesSection /> },
    { path: "/medicalAppointments", element: <MedicalReportsSection /> },
    { path: "/registerPatient", element: <RegisterPatient /> },
    { path: "/login", element: <Login /> },
    { path: "/otpScreen", element: <OtpScreen /> },

    // Rutas del paciente (protegidas)
    {
        path: "/patient/home",
        element: <ProtectedRoute element={<HomePatient />} allowedRole= {1} />,
    },

    // Rutas del administrador (puedes protegerlas más adelante si es necesario)
    // Ejemplo: { path: "/admin/dashboard", element: <ProtectedRoute element={<AdminDashboard />} allowedRole="admin" /> },

    // Rutas del doctor (puedes protegerlas más adelante si es necesario)
    // Ejemplo: { path: "/doctor/schedule", element: <ProtectedRoute element={<DoctorSchedule />} allowedRole="doctor" /> },
];