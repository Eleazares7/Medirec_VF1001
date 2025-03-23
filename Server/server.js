// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';; // Necesitamos node-fetch para hacer solicitudes HTTP desde el backend

import userRoutes from "./Routes/userRoutes.js";
import apiRoutes from "./Routes/apiRoutes.js"
import userValidationRoutes from "./Routes/userValidationRoutes.js"
import loginRoutes from "./Routes/loginRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js"

const app = express();

// Configurar middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Origen del frontend
    credentials: true, // Permitir credenciales
}));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key', // Usa una clave segura
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambia a true en producción con HTTPS
        httpOnly: true,
        sameSite: 'lax', // O 'none' con secure: true en producción
        maxAge: 24 * 60 * 60 * 1000 // 24 horas de duración
    }
}));

// Rutas usuarios
app.use('/users', userRoutes);

app.use('/validation', userValidationRoutes);

app.use('/2fa', apiRoutes);

app.use('/login', loginRoutes);

app.use('/admin', adminRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});