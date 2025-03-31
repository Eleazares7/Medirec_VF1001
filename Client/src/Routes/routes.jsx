// Route --> src/Routes/routes.jsx

// VIEWER ROUTES
import Home from "../Pages/Home";
import ServicesSection from "../Pages/Services";
import MedicalReportsSection from "../Pages/MedicalReportSession";
import RegisterPatient from "../Pages/Patients/RegisterPatient";
import Login from "../Pages/Login";
import OtpScreen from "../Pages/OtpScreen";
import Pharmacy from "../Pages/Pharmacy.jsx";

// PATIENT ROUTES
import HomePatient from "../Pages/Patients/HomePatient";
import Profile from "../Pages/Patients/Profile.jsx";
import CreateAppointment from "../Pages/Patients/CreateAppointment.jsx";
import ManagementAppointments from "../Pages/Patients/ManagementAppointments.jsx";
import ViewAppointments from "../Pages/Patients/ViewAppointments.jsx";
import ManagementHistorial from "../Pages/Patients/ManageHistorial.jsx";

// ADMINISTRATOR ROUTES
import HomeAdmin from "../Pages/Admin/HomeAdmin.jsx";
import ManageUsers from "../Pages/Admin/ManageUsers.jsx";
import ManageDoctors from "../Pages/Admin/ManageDoctors.jsx";
import AddDoctor from "../Pages/Admin/AddDoctor.jsx";
import ManageProducts from "../Pages/Admin/ManageProducts.jsx";
import AddProduct from "../Pages/Admin/AddProduct.jsx";
import DoctorReports from "../Pages/Admin/DoctorReports.jsx";

// DOCTOR ROUTES
import HomeDoctor from "../Pages/Doctor/HomeDoctor.jsx";

//Rutas Protegidas 
import ProtectedRoute from "../Routes/ProtectedRoute.jsx";


export const routes = [
    /*------------------------------------- RUTAS VIEWERE ------------------------------------- */
    { path: "/", element: <Home />, index: true },
    { path: "/services", element: <ServicesSection /> },
    { path: "/medicalAppointments", element: <MedicalReportsSection /> },
    { path: "/registerPatient", element: <RegisterPatient /> },
    { path: "/login", element: <Login /> },
    { path: "/otpScreen", element: <OtpScreen /> },
    { path: "/pharmacy", element: <Pharmacy /> },


    /*------------------------------------- RUTAS DEL PACIENTE -------------------------------------*/
    { path: "/patient/home", element: <ProtectedRoute element={<HomePatient />} allowedRole={1} /> },
    { path: "/patient/profile", element: <ProtectedRoute element={<Profile />} allowedRole={1} /> },
    { path: "/patient/createAppointment", element: <ProtectedRoute element={<CreateAppointment />} allowedRole={1} /> },
    { path: "/patient/manageAppointments", element: <ProtectedRoute element={<ManagementAppointments />} allowedRole={1} /> },
    { path: "/patient/viewAppointments", element: <ProtectedRoute element={<ViewAppointments />} allowedRole={1} /> },
    {path: "/patient/manageHistorial", element: <ProtectedRoute element={<ManagementHistorial />} allowedRole={1} />},


    /*------------------------------------- RUTAS DEL ADMINISTRADOR -------------------------------------*/
    { path: "/admin/home", element: <ProtectedRoute element={<HomeAdmin />} allowedRole={3} /> },
    { path: "/admin/manageUsers", element: <ProtectedRoute element={<ManageUsers />} allowedRole={3} /> },
    { path: "/admin/users/manageDoctors", element: <ProtectedRoute element={<ManageDoctors />} allowedRole={3} /> },
    { path: "/admin/users/addDoctor", element: <ProtectedRoute element={<AddDoctor />} allowedRole={3} /> },
    { path: "/admin/users/reportDoctors", element: <ProtectedRoute element={<DoctorReports />} allowedRole={3} /> },
    { path: "/admin/products/manageProducts", element: <ProtectedRoute element={<ManageProducts />} allowedRole={3} /> },
    { path: "/admin/products/addProduct", element: <ProtectedRoute element={<AddProduct />} allowedRole={3} /> },


    /*------------------------------------- RUTAS DEL DOCTOR -------------------------------------*/
    // Doctor Home
    { path: "/doctor/home", element: <ProtectedRoute element={<HomeDoctor />} allowedRole={2} /> }


];