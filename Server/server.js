// server.js
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch'; // Necesitamos node-fetch para hacer solicitudes HTTP desde el backend

import userRoutes from "./Routes/userRoutes.js";

const app = express();

// Configurar middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Configurar Multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rutas usuarios
app.use('/users', userRoutes);







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});