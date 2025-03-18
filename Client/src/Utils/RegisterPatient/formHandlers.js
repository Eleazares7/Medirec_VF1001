// Utils/RegisterPatient/formHandlers.js
import Swal from "sweetalert2";

// handleChange ahora recibe todos los parámetros necesarios como argumentos
export const handleChange = async (
    e,
    formData,
    setFormData,
    setColonias,
    setApiError
) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "codigoPostal" && value.length === 5) {
        try {
            const response = await fetch(
                `http://localhost:5000/users/codigo-postal/${value}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (!data.error) {
                const { codigo_postal } = data;
                setColonias(codigo_postal.colonias || []);
                setFormData((prevData) => ({
                    ...prevData,
                    asentamiento:
                        codigo_postal.colonias.length > 0 ? codigo_postal.colonias[0] : "",
                    municipio: codigo_postal.municipio || "",
                    estado: codigo_postal.estado || "",
                    pais: "México",
                }));
                setApiError(null);
            } else {
                setColonias([]);
                setApiError(data.message);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message || "No se pudo obtener la información del código postal.",
                    confirmButtonText: "Cerrar",
                    customClass: {
                        popup: "bg-teal-50 rounded-lg shadow-lg",
                        title: "text-2xl font-bold text-teal-800",
                        confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                    },
                });
            }
        } catch (error) {
            console.error("Error al hacer la solicitud al backend:", error);
            setColonias([]);
            setApiError(error.message || "No se pudo obtener la información del código postal.");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudo obtener la información del código postal.",
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "bg-teal-50 rounded-lg shadow-lg",
                    title: "text-2xl font-bold text-teal-800",
                    confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                },
            });
        }
    }
};

// handleSubmit recibe los parámetros necesarios como argumentos
export const handleSubmit = async (e, formData, navigate) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmarContrasena) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Las contraseñas no coinciden.",
            confirmButtonText: "Cerrar",
            customClass: {
                popup: "bg-teal-50 rounded-lg shadow-lg",
                title: "text-2xl font-bold text-teal-800",
                confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
            },
        });
        return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
    });

    // Validar que el email no sea duplicado
    try {
        const response = await fetch(
            `http://localhost:5000/validation/emailValidation?email=${encodeURIComponent(formData.email)}`,
            {
                method: "GET",
                credentials: "include",
            }
        );
        const data = await response.json();

        if (data.success) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `${data.message}`,
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "bg-teal-50 rounded-lg shadow-lg",
                    title: "text-2xl font-bold text-teal-800",
                    confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                },
            });
            return;
        }
    } catch (error) {
        console.log(`Error al verificar el email: ${error}`);
        return;
    }

    // Validar fecha de nacimiento correcta
    try {
        const response = await fetch(
            `http://localhost:5000/validation/birthdateValidation?fechaNacimiento=${encodeURIComponent(formData.fechaNacimiento)}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        if (data.success) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `${data.message}`,
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "bg-teal-50 rounded-lg shadow-lg",
                    title: "text-2xl font-bold text-teal-800",
                    confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                },
            });
            return;
        }
    } catch (error) {
        console.error("Error al validar fecha de nacimiento: " + error);
        return;
    }

    // Validar contraseña
    try {
        const response = await fetch(
            `http://localhost:5000/validation/passwordValidation?contrasena=${encodeURIComponent(formData.contrasena)}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        if (data.success) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `${data.message}`,
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "bg-teal-50 rounded-lg shadow-lg",
                    title: "text-2xl font-bold text-teal-800",
                    confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                },
            });
            return;
        }
    } catch (error) {
        console.error(`Error al validar la contraseña: ${error}`);
        return;
    }

    // Registrar el paciente
    try {
        const response = await fetch("http://localhost:5000/users/register-patient", {
            method: "POST",
            body: formDataToSend,
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "¡OTP Enviado!",
                text: data.message || "Revisa tu correo para verificar el OTP.",
                confirmButtonText: "Aceptar",
                customClass: {
                    popup: "bg-teal-50 rounded-lg shadow-lg",
                    title: "text-2xl font-bold text-teal-800",
                    confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                },
            }).then(() => {
                navigate("/otpScreen", { state: { email: formData.email } });
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message || "No se pudo enviar el OTP.",
                confirmButtonText: "Cerrar",
                customClass: {
                    popup: "bg-teal-50 rounded-lg shadow-lg",
                    title: "text-2xl font-bold text-teal-800",
                    confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
                },
            });
        }
    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al procesar la solicitud. Por favor, intenta de nuevo.",
            confirmButtonText: "Cerrar",
            customClass: {
                popup: "bg-teal-50 rounded-lg shadow-lg",
                title: "text-2xl font-bold text-teal-800",
                confirmButton: "bg-teal-600 text-white hover:bg-teal-500",
            },
        });
    }
};