import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.js'; // Asegúrate de que este archivo exporte tu conexión a la base de datos

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_aqui";

router.get("/getAdmin/:email", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    // Verificar si se proporcionó un token
    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = req.params.email;

        // Asegurarse de que el email del token coincida con el email solicitado
        if (decoded.email !== email) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        // Buscar el id_usuario en la tabla usuarios usando el email
        const [searchIdUser] = await db.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
        if (searchIdUser.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const id = searchIdUser[0].id_usuario;

        // Hacer un JOIN entre las tablas usuarios y administradores para obtener todos los datos
        const [rows] = await db.query(
            `SELECT u.id_usuario, u.email, u.contrasena, u.id_rol, u.fecha_registro, 
                    a.id_administrador, a.nombre, a.apellido, a.telefono, a.fecha_inicio, a.estado 
             FROM usuarios u 
             INNER JOIN administradores a ON u.id_usuario = a.id_usuario 
             WHERE u.id_usuario = ?`,
            [id]
        );

        // Verificar si se encontraron datos
        if (rows.length === 0) {
            return res.status(404).json({ message: "Administrador no encontrado" });
        }

        const admin = rows[0];

        // En este caso, no hay manejo de imágenes como en el endpoint de pacientes, pero si necesitas agregar una foto,
        // puedes incluir una lógica similar aquí (por ejemplo, si la tabla administradores tuviera un campo pathFoto).

        // Log para depuración
        console.log("Datos enviados al frontend:", admin);

        // Devolver los datos del administrador
        res.status(200).json(admin);
    } catch (error) {
        console.error("Error al obtener datos del administrador:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;