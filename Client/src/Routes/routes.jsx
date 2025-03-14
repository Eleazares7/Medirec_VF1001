import Home from "../Pages/Home";
import ServicesSection from "../Pages/Services";
import MedicalReportsSection from "../Pages/MedicalReportSession";

export const routes = [
    { path: '/', element: <Home />, index: true },
    { path: '/services', element: <ServicesSection /> },
    { path: '/MedicalAppointments', element: <MedicalReportsSection /> }

    //Rutas del paciente

    //Rutas del administrador

    //Rutas del doctor

];