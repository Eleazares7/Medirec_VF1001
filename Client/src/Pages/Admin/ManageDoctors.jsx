import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../Components/AdminComponents/HomeAdmin/NavBarAdmin.jsx';
import DoctorOptions from '../../Components/AdminComponents/ManageDoctors/DoctorOptions.jsx';
import DoctorList from '../../Components/AdminComponents/ManageDoctors/DoctorList.jsx';
import LoadingSpinner from '../../Components/AdminComponents/ManageDoctors/LoadingSpinner.jsx';
import Swal from 'sweetalert2';

const ManageDoctors = () => {
  const [showList, setShowList] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showList) {
      fetchDoctors();
    }
  }, [showList]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token de autenticación.");

      const response = await fetch('http://localhost:5000/admin/users/getDoctors', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener la lista de doctores.');
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: '#0d9488',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        {showList ? (
          <DoctorList 
            doctors={doctors} 
            onBack={() => setShowList(false)} 
            fetchDoctors={fetchDoctors} // Pasar fetchDoctors como prop
          />
        ) : (
          <DoctorOptions onShowList={() => setShowList(true)} />
        )}
      </div>
    </>
  );
};

export default ManageDoctors;