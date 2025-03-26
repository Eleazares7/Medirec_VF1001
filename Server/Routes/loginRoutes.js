// routes/auth.js
import db from "../config/db.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "tu_clave_secreta_aqui";

router.post("/loginValidation", async (req, res) => {
    const { contrasena, email } = req.body;


    try {
        const [usuario] = await db.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
        if (usuario.length === 0) {
            return res.status(401).json({ message: "El email no está registrado" });
        }

        const hashPassword = usuario[0].contrasena;
        const isPasswordValid = await bcrypt.compare(contrasena, hashPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const rol = usuario[0].id_rol;
        const emailUser = usuario[0].email;
        const idUser = usuario[0].id_usuario;

        const token = jwt.sign(
            { id: idUser, email: emailUser, role: rol },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            role: rol,
            email: emailUser,
        });
    } catch (error) {
        console.error("Error en loginValidation:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.get("/verify", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [decoded.email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];
        res.status(200).json({
            id: user.id_usuario,
            email: user.email,
            role: user.id_rol,
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token inválido" });
        }
        console.error("Error en verify:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;