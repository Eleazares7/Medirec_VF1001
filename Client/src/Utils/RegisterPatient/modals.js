import Swal from "sweetalert2"

const showPasswordRequirements = () => {
        Swal.fire({
            title: 'Requisitos de Contraseña',
            html: `
                <ul style="text-align: left; color: #0f766e;">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una letra mayúscula</li>
                    <li>Al menos un número</li>
                    <li>Al menos un carácter especial (ej. !@#)</li>
                </ul>
            `,
            icon: 'info',
            confirmButtonText: 'Cerrar',
            customClass: {
                popup: 'bg-teal-50 rounded-lg shadow-lg',
                title: 'text-2xl font-bold text-teal-800',
                confirmButton: 'bg-teal-600 text-white hover:bg-teal-500',
            },
        });
    };


export default showPasswordRequirements;