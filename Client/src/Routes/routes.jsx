// src/Routes/routes.jsx
import Home from "../Pages/Home";
import ServicesSection from "../Pages/Services";
import MedicalReportsSection from "../Pages/MedicalReportSession";
import RegisterPatient from "../Pages/Patients/RegisterPatient";
import Login from "../Pages/Login";
import OtpScreen from "../Pages/OtpScreen";
import Pharmacy from "../Pages/Pharmacy.jsx";

import HomePatient from "../Pages/Patients/HomePatient";
import ProtectedRoute from "../Routes/ProtectedRoute.jsx";
import Profile from "../Pages/Patients/Profile.jsx";
import CreateAppointment from "../Pages/Patients/CreateAppointment.jsx";
import ManagementAppointments from "../Pages/Patients/ManagementAppointments.jsx";

import HomeAdmin from "../Pages/Admin/HomeAdmin.jsx";
import ManageUsers from "../Pages/Admin/ManageUsers.jsx";
import ManageDoctors from "../Pages/Admin/ManageDoctors.jsx";
import AddDoctor from "../Pages/Admin/AddDoctor.jsx";
import ManageProducts from "../Pages/Admin/ManageProducts.jsx";
import AddProduct from "../Pages/Admin/AddProduct.jsx";

import HomeDoctor from "../Pages/Doctor/HomeDoctor.jsx";


export const routes = [
    { path: "/", element: <Home />, index: true },
    { path: "/services", element: <ServicesSection /> },
    { path: "/medicalAppointments", element: <MedicalReportsSection /> },
    { path: "/registerPatient", element: <RegisterPatient /> },
    { path: "/login", element: <Login /> },
    { path: "/otpScreen", element: <OtpScreen /> },
    { path: "/pharmacy", element: <Pharmacy /> },

    // Rutas del paciente (protegidas)
    {
        path: "/patient/home",
        element: <ProtectedRoute element={<HomePatient />} allowedRole={1} />,
    },
    {
        path: "/patient/profile",
        element: <ProtectedRoute element={<Profile />} allowedRole={1} />
    },
    {
        path: "/patient/createAppointment",
        element: <ProtectedRoute element={<CreateAppointment />} allowedRole={1} />
    },
    {
        path: "/patient/manageAppointments",
        element: <ProtectedRoute element={<ManagementAppointments />} allowedRole={1} />
    },

    // Rutas del administrador (puedes protegerlas más adelante si es necesario)
    {
        path: "/admin/home",
        element: <ProtectedRoute element={<HomeAdmin />} allowedRole={3} />
    },
    {
        path: "/admin/manageUsers",
        element: <ProtectedRoute element={<ManageUsers />} allowedRole={3} />
    },
    {
        path: "/admin/users/manageDoctors",
        element: <ProtectedRoute element={<ManageDoctors />} allowedRole={3} />
    },
    {
        path: "/admin/users/addDoctor",
        element: <ProtectedRoute element={<AddDoctor />} allowedRole={3} />
    },
    {
        path: "/admin/products/manageProducts",
        element: <ProtectedRoute element={<ManageProducts />} allowedRole={3} />
    },
    {
        path: "/admin/products/addProduct",
        element: <ProtectedRoute element={<AddProduct />} allowedRole={3} />
    },
    
    // Rutas del doctor
    {
        path: "/doctor/home",
        element: <ProtectedRoute element={<HomeDoctor />} allowedRole={2} />
    }
    

];