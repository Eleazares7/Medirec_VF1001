import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import db from '../Config/db.js'; // Asegúrate de que la ruta sea correcta

dotenv.config();

const router = express.Router();

// Almacén temporal para OTPs
const otpStore = {};

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Función para generar OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // OTP de 6 dígitos
};

// Endpoint para enviar OTP
router.post('/send', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email requerido' });
    }

    try {
       
        // Si el email no existe, proceder a generar y enviar el OTP
        const otp = generateOTP();
        otpStore[email] = { code: otp, expires: Date.now() + 5 * 60 * 1000 }; // Expira en 5 minutos

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Tu código de verificación',
            text: `Tu código OTP es: ${otp}. Válido por 5 minutos.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                    <h2 style="color: #333;">Verificación en Dos Pasos</h2>
                    <p style="color: #666;">Hola, aquí está tu código de verificación para acceder a tu cuenta:</p>
                    <div style="background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h3 style="color: #007bff; font-size: 24px; margin: 0;">${otp}</h3>
                        <p style="color: #666; font-size: 14px;">Este código es válido por 5 minutos.</p>
                    </div>
                    <p style="color: #666; margin-top: 20px;">Si no solicitaste este código, ignora este correo.</p>
                    <footer style="margin-top: 20px; font-size: 12px; color: #999;">
                        <p>© 2025 Tu Aplicación. Todos los derechos reservados.</p>
                    </footer>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Código enviado al correo' });
    } catch (error) {
        console.error('Error al procesar /2fa/send:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el OTP', error: error.message });
    }
});

// Endpoint para verificar OTP 
router.post('/verify', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email y código requeridos' });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp) {
        return res.status(400).json({ success: false, message: 'No hay código generado para este email' });
    }

    if (Date.now() > storedOtp.expires) {
        delete otpStore[email];
        return res.status(400).json({ success: false, message: 'Código expirado' });
    }

    if (storedOtp.code === code) {
        delete otpStore[email];
        res.json({ success: true, message: 'Verificación exitosa' });
    } else {
        res.json({ success: false, message: 'Código inválido' });
    }
});

export default router;