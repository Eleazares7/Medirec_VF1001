import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import userRoutes from "./Routes/userRoutes.js";
import apiRoutes from "./Routes/apiRoutes.js";
import userValidationRoutes from "./Routes/userValidationRoutes.js";
import loginRoutes from "./Routes/loginRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import doctorRoutes from "./Routes/doctorRoutes.js";
import homeRoutes from "./Routes/homeRoutes.js";
import payPalRoutes from "./Routes/payPalRoutes.js";

const app = express();

// Configurar middleware
app.use(express.json({ limit: '10mb' })); // Aumentar límite a 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true en producción con HTTPS
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Rutas
app.use('/users', userRoutes);
app.use('/validation', userValidationRoutes);
app.use('/2fa', apiRoutes);
app.use('/login', loginRoutes);
app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);
app.use('/home', homeRoutes);
app.use('/api', payPalRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});