import Home from "../Pages/Home";
import ServicesSection from "../Pages/Services";
import MedicalReportsSection from "../Pages/MedicalReportSession";
import RegisterPatient from "../Pages/Patients/RegisterPatient";
import Login from "../Pages/Login";

export const routes = [
    { path: '/', element: <Home />, index: true },
    { path: '/services', element: <ServicesSection /> },
    { path: '/medicalAppointments', element: <MedicalReportsSection /> },
    { path: '/registerPatient', element: <RegisterPatient /> },
    { path: '/login', element: <Login /> }

    //Rutas del paciente

    //Rutas del administrador

    //Rutas del doctor

];