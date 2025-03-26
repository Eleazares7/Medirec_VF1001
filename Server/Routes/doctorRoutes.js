import express from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import db from "../config/db.js"

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_aqui";

router.get("/getDoctor/:email", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    

    if (!token) {
        return res.status(401).json({ message: "No se porporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = req.params.email;


        if (decoded.email !== email) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }


        const [searchIdDoctor] = await db.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
        if (searchIdDoctor.length === 0) {
            return res.status(404).json({ message: "Doctor no encontrado" })
        }



        const id = searchIdDoctor[0].id_usuario;


        const [rows] = await db.query(`SELECT id_medico, nombre,apellido,especialidad,numero_licencia,foto,foto_mime_type FROM usuarios, medicos WHERE usuarios.id_usuario = ? and medicos.id_usuario = ?`, [id, id]);


        if (rows.length === 0) return res.status(404).json({ message: "Doctor no encontrado" });

        const doctor = rows[0];


        res.status(200).json(doctor);
    } catch (error) {
        console.error("Error al obtener datos del Doctor:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }


});




export default router;