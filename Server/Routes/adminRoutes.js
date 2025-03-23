import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.js'; // Asegúrate de que este archivo exporte tu conexión a la base de datos
import multer from 'multer'; // Importamos multer para manejar FormData
import bcrypt from 'bcrypt'; // Para hashear la contraseña

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_aqui";

// Configuración de Multer para manejar archivos
const storage = multer.memoryStorage(); // Almacenamos el archivo en memoria
const upload = multer({ storage: storage });

// Ruta para registrar un doctor
router.post("/registerDoctor", upload.single('foto'), async (req, res) => {
    // Extraer el token del encabezado Authorization
    const token = req.headers.authorization?.split(" ")[1] || "No token provided";

    // Validar que se proporcionó un token
    if (!token || token === "No token provided") {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        // Extraer los datos del cuerpo de la solicitud
        const { email, contrasena, confirmarContrasena, nombre, apellido, especialidad, numero_licencia, adminEmail } = req.body;
        const foto = req.file;

        // Crear un objeto con todos los datos recibidos (para el console.log)
        const formData = {
            email,
            contrasena,
            nombre,
            apellido,
            especialidad,
            numero_licencia,
            adminEmail,
            foto: foto ? {
                filename: foto.originalname,
                size: foto.size,
                mimetype: foto.mimetype,
                buffer: foto.buffer.toString('base64').substring(0, 50) + '...' // Mostrar solo los primeros 50 caracteres del buffer en base64
            } : null,
        };

        // Mostrar los datos y el token en la consola
        console.log('Datos recibidos en /admin/registerDoctor:');
        console.log('Token:', token);
        console.log('FormData:', formData);

        // Validaciones
        // 1. Validar que todos los campos obligatorios estén presentes
        if (!email || !contrasena || !confirmarContrasena || !nombre || !apellido || !especialidad || !numero_licencia || !adminEmail) {
            return res.status(400).json({ message: "Faltan datos obligatorios. Asegúrate de completar todos los campos." });
        }

        // 2. Validar que las contraseñas coincidan
        if (contrasena !== confirmarContrasena) {
            return res.status(400).json({ message: "Las contraseñas no coinciden." });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial (por ejemplo, !@#$%^&*())."
            });
        }

        // 3. Validar que el número de licencia tenga exactamente 10 dígitos
        const numeroLicenciaRegex = /^\d{10}$/;
        if (!numeroLicenciaRegex.test(numero_licencia)) {
            return res.status(400).json({ message: "El número de licencia debe tener exactamente 10 dígitos." });
        }

        // 4. Validar que se haya subido una foto
        if (!foto) {
            return res.status(400).json({ message: "La foto es obligatoria." });
        }

        // 5. Validar que el correo no esté registrado
        const [existingUser] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        // Iniciar una transacción para asegurar consistencia
        await db.query("START TRANSACTION");

        try {
            // 6. Hashear la contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            // 7. Insertar en la tabla usuarios
            const [userResult] = await db.query(
                "INSERT INTO usuarios (email, contrasena, id_rol, fecha_registro) VALUES (?, ?, ?, NOW())",
                [email, hashedPassword, 2] // Asumimos que id_rol = 2 es para médicos
            );

            const id_usuario = userResult.insertId;

            // 8. Insertar en la tabla medicos
            await db.query(
                "INSERT INTO medicos (id_usuario, nombre, apellido, especialidad, numero_licencia, foto, foto_mime_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [id_usuario, nombre, apellido, especialidad, numero_licencia, foto.buffer, foto.mimetype]
            );

            // Confirmar la transacción
            await db.query("COMMIT");

            // Responder al cliente
            res.status(201).json({ message: "Doctor registrado exitosamente." });
        } catch (error) {
            // Revertir la transacción en caso de error
            await db.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Error al registrar el doctor:", error);
        res.status(500).json({ message: "Error interno del servidor al registrar el doctor." });
    }
});

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

        // Log para depuración
        console.log("Datos enviados al frontend:", admin);

        // Devolver los datos del administrador
        res.status(200).json(admin);
    } catch (error) {
        console.error("Error al obtener datos del administrador:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


router.get("/users/getDoctors", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    // Validar que se proporcionó un token
    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Hacer un JOIN entre las tablas usuarios y medicos para obtener los datos de los doctores
        const [doctors] = await db.query(
            `SELECT u.id_usuario, u.email, m.id_medico, m.nombre, m.apellido, m.especialidad, m.numero_licencia, m.foto, m.foto_mime_type
             FROM usuarios u
             INNER JOIN medicos m ON u.id_usuario = m.id_usuario
             WHERE u.id_rol = ?`,
            [2] // Asumimos que id_rol = 2 es para médicos
        );

        // Si no hay doctores, devolver un array vacío
        if (doctors.length === 0) {
            return res.status(200).json([]);
        }

        // Mapear los resultados para incluir la foto como base64
        const doctorsWithPhoto = doctors.map(doctor => {
            const photoBase64 = doctor.foto ? Buffer.from(doctor.foto).toString('base64') : null;
            const photoUrl = photoBase64 ? `data:${doctor.foto_mime_type};base64,${photoBase64}` : null;

            return {
                id: doctor.id_medico,
                nombre: `${doctor.nombre} ${doctor.apellido}`,
                especialidad: doctor.especialidad,
                email: doctor.email,
                numero_licencia: doctor.numero_licencia,
                foto: photoUrl, // URL de la imagen en formato base64
            };
        });

        // Log para depuración
        console.log("Doctores enviados al frontend:", doctorsWithPhoto);

        // Devolver la lista de doctores
        res.status(200).json(doctorsWithPhoto);
    } catch (error) {
        console.error("Error al obtener la lista de doctores:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la lista de doctores." });
    }
});
export default router;