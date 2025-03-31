// src/components/Profile/useProfile.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const useProfile = (user) => {
    const [patientData, setPatientData] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [photoUrl, setPhotoUrl] = useState(null);
    const [newPhoto, setNewPhoto] = useState(null);
    const [newPhotoPreview, setNewPhotoPreview] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingCp, setIsLoadingCp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!user || !user.email) {
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se proporcionó token. Por favor, inicia sesión nuevamente.',
                    confirmButtonColor: '#3085d6',
                });
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/users/patient/${user.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error al obtener los datos del paciente: ${response.statusText}`);
                }

                const data = await response.json();
                setPatientData(data);
                setEditedData(data);

                if (data.fotoData && data.fotoData.data) {
                    const byteArray = new Uint8Array(data.fotoData.data);
                    const blob = new Blob([byteArray], { type: data.fotoMimeType || 'image/jpeg' });
                    const url = URL.createObjectURL(blob);
                    setPhotoUrl(url);
                }
            } catch (error) {
                console.error('Error al cargar los datos del paciente:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Error al cargar los datos del paciente.',
                    confirmButtonColor: '#3085d6',
                });
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
            if (newPhotoPreview) {
                URL.revokeObjectURL(newPhotoPreview);
            }
        };
    }, [patientData, photoUrl, newPhotoPreview]);

    const handleInputChange = (field, value) => {
        setEditedData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La foto no debe exceder los 5MB.',
                    confirmButtonColor: '#3085d6',
                });
                return;
            }
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, sube un archivo de imagen válido.',
                    confirmButtonColor: '#3085d6',
                });
                return;
            }
            setNewPhoto(file);
            const previewUrl = URL.createObjectURL(file);
            setNewPhotoPreview(previewUrl);
        }
    };

    const handleCpChange = async (value) => {
        if (!value || !isEditing) return;

        // Validar que el código postal tenga exactamente 5 dígitos
        if (value.length !== 5) {
            return; // No hacer nada si no tiene 5 dígitos
        }

        setIsLoadingCp(true);

        try {
            const response = await fetch(`http://localhost:5000/users/codigo-postal/${value}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al consultar el código postal');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.message);
            }

            const { estado, municipio, colonias, codigo_postal } = data.codigo_postal;

            setEditedData((prev) => ({
                ...prev,
                codigoPostal: codigo_postal || value,
                estado: estado || prev.estado,
                municipio: municipio || prev.municipio,
                asentamiento: colonias.length > 0 ? colonias[0] : prev.asentamiento,
                pais: prev.pais || 'México',
            }));
        } catch (error) {
            console.error('Error al consultar el código postal:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al consultar el código postal: ' + error.message,
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setIsLoadingCp(false);
        }
    };  

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se proporcionó token. Por favor, inicia sesión nuevamente.',
                confirmButtonColor: '#3085d6',
            });
            navigate('/login');
            return;
        }

        // Comparar patientData con editedData para identificar los cambios
        const changes = {};
        let hasChanges = false;

        // Lista de campos editables
        const editableFields = [
            'nombre',
            'apellido',
            'telefono',
            'fechaNacimiento',
            'codigoPostal',
            'alergias',
            'antecedentes_medicos',
        ];

        // Comparar cada campo editable
        for (const field of editableFields) {
            if (patientData[field] !== editedData[field]) {
                changes[field] = editedData[field];
                hasChanges = true;
            }
        }

        // Verificar si hay una nueva foto
        if (newPhoto) {
            changes.foto = newPhoto; // Cambiar 'photo' a 'foto'
            hasChanges = true;
        }

        // Si no hay cambios, mostrar un mensaje y salir
        if (!hasChanges) {
            Swal.fire({
                icon: 'info',
                title: 'Sin Cambios',
                text: 'No se han realizado cambios.',
                confirmButtonColor: '#3085d6',
            });
            setIsEditing(false);
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(changes).forEach((key) => {
                if (changes[key] !== undefined && changes[key] !== null) {
                    formData.append(key, changes[key]);
                }
            });

            const response = await fetch(`http://localhost:5000/users/updatePatient/${user.email}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar los datos');
            }

            const updatedData = await response.json();
            setPatientData(updatedData);
            setEditedData(updatedData);

            if (updatedData.fotoData && updatedData.fotoData.data) {
                const byteArray = new Uint8Array(updatedData.fotoData.data);
                const blob = new Blob([byteArray], { type: updatedData.fotoMimeType || 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                setPhotoUrl(url);
            }

            setNewPhoto(null);
            setNewPhotoPreview(null);
            setIsEditing(false);

            // Mostrar notificación de éxito
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Perfil actualizado con éxito.',
                confirmButtonColor: '#3085d6',
            });
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al actualizar el perfil.',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditedData(patientData);
        setNewPhoto(null);
        setNewPhotoPreview(null);
    };

    return {
        patientData,
        editedData,
        photoUrl,
        newPhotoPreview,
        isVisible,
        isEditing,
        isLoadingCp,
        setIsEditing,
        handleInputChange,
        handlePhotoChange,
        handleCpChange,
        handleSubmit,
        cancelEdit,
        navigate,
    };
};

export default useProfile;