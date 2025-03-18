import db from "../Config/db.js";
import express from "express"
import axios from "axios";


const router = express.Router();

router.get('/emailValidation', async (req, res) => {
    const { email } = req.query;

    //Validar si un correo fue recibido desde el front
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'El correo es requerido.'
        });
    }

    // Buscar si el correo electrónico ya esta en uso
    try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM usuarios WHERE email = ?', [email]);
        const emailCount = rows[0].count;

        if (emailCount > 0) {
            return res.status(400).json({
                success: true,
                message: 'El correo ya está registrado.\n Por favor, usa otro correo o inicia sesión.'
            });
        } else {
            return res.status(200).json({
                success: false,
            });
        }
    } catch (error) {
        console.error('Error al validar el email:', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el correo.'
        });
    };

});

router.get('/birthdateValidation', (req, res) => {
    const { fechaNacimiento } = req.query;

    if (!fechaNacimiento) {
        return res.status(400).json({
            success: false,
            message: 'La fecha de nacimiento es requerida.'
        });
    }

    // Convertir la fecha de nacimiento a un objeto Date
    const date = new Date(fechaNacimiento);
    const patientYear = date.getUTCFullYear();
    const today = new Date();
    const year = today.getFullYear();

    // Verificar si el usuario es mayor de edad
    if ((year - patientYear) < 18) {
        return res.status(400).json({
            success: true,
            message: 'No puedes crear una cuenta, debes ser mayor de edad.'
        });
    }

    if (patientYear < 1930 || year < patientYear) {
        return res.status(400).json({
            success: true,
            message: 'Año de nacimiento inválido.'
        });
    } else {
        return res.status(400).json({
            success: false,
        });
    }
});

router.get('/passwordValidation', (req, res) => {
    const { contrasena } = req.query;

    if (!contrasena) {
        return res.status(400).json({
            success: true,
            message: 'La contraseña es requerida.'
        });
    }

    const SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*(),.?":{}|<>_]/;
    const errors = [];

    if (!/[A-Z]/.test(contrasena)) {
        errors.push("una mayúscula");
    }
    if (!/[a-z]/.test(contrasena)) {
        errors.push("una minúscula");
    }
    if (!/[0-9]/.test(contrasena)) {
        errors.push("un número");
    }
    if (!SPECIAL_CHARACTERS_REGEX.test(contrasena)) {
        errors.push("un carácter especial");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: true,
            message: `La contraseña debe contener al menos: ${errors.join(', ')}.`
        });
    }else{
        return res.status(200).json({
            success: false,            
        });
    }

})



export default router;