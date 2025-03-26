// routes/userRoutes.js
import express from "express";
import db from "../config/db.js"
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs/promises"; // Para leer archivos

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_aqui";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer para guardar archivos en disco
const uploadDir = path.join(__dirname, "../uploads");
fs.mkdir(uploadDir, { recursive: true }); // Crea la carpeta uploads si no existe

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Usa el nombre original del archivo
    },
});
const upload = multer({ storage });

// Ruta para obtener datos del paciente
router.get("/patient/:email", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = req.params.email;

        if (decoded.email !== email) {
            return res.status(403).json({ message: "Acceso no autorizado" });
        }

        const [searchIdUser] = await db.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
        if (searchIdUser.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const id = searchIdUser[0].id_usuario;
        const [rows] = await db.query(
            "SELECT * FROM usuarios u INNER JOIN pacientes p ON u.id_usuario = p.id_usuario WHERE u.id_usuario = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        const patient = rows[0];

        // Leer la imagen desde la carpeta uploads usando pathFoto
        if (patient.pathFoto) {
            const filePath = path.join(__dirname, "..", patient.pathFoto); // Ruta absoluta
            try {
                const imageBuffer = await fs.readFile(filePath); // Leer el archivo como Buffer
                patient.fotoData = imageBuffer; // Agregar los datos binarios al objeto
                patient.fotoMimeType = patient.fotoMimeType || "image/jpeg"; // Asegurar tipo MIME
            } catch (fileError) {
                console.error("Error al leer la imagen desde uploads:", fileError);
                patient.fotoData = null; // Si falla, no incluimos la imagen
            }
        } else {
            patient.fotoData = null;
        }

        res.status(200).json(patient);
    } catch (error) {
        console.error("Error al obtener datos del paciente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para iniciar el registro y enviar OTP
router.post("/register-patient", upload.single("foto"), async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            telefono,
            fechaNacimiento,
            calle,
            numeroExterior,
            entreCalle1,
            entreCalle2,
            codigoPostal,
            asentamiento,
            municipio,
            estado,
            pais,
            alergias,
            antecedentes_medicos,
            email,
            contrasena,
            confirmarContrasena,
            nombreFoto,
        } = req.body;

        const foto = req.file; // Multer guarda la foto en disco

        if (!email || !contrasena || !confirmarContrasena) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }

        if (contrasena !== confirmarContrasena) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" });
        }

        // Verificar si el email ya existe
        const [existingUser] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Llamar al endpoint 2fa/send para enviar OTP
        const otpResponse = await axios.post("http://localhost:5000/2fa/send", { email });
        if (!otpResponse.data.success) {
            return res.status(400).json({ message: otpResponse.data.message || "Error al enviar el OTP" });
        }

        // Guardar datos en la sesión
        req.session.tempUserData = {
            nombre,
            apellido,
            telefono,
            fechaNacimiento,
            calle,
            numeroExterior,
            entreCalle1,
            entreCalle2,
            codigoPostal,
            asentamiento,
            municipio,
            estado,
            pais,
            alergias,
            antecedentes_medicos,
            email,
            contrasena,
            foto: foto ? foto.filename : null,
            fotoMimeType: foto ? foto.mimetype : null,
            nombreFoto: nombreFoto || (foto ? foto.originalname : null),
        };

        console.log("Datos guardados en sesión:", req.session.tempUserData);

        res.status(200).json({
            message: "OTP enviado. Por favor, verifica tu correo.",
            redirectTo: "/otpScreen",
        });
    } catch (error) {
        console.error("Error en /users/register-patient:", error);
        res.status(500).json({ message: "Error al procesar la solicitud" });
    }
});

// Ruta para guardar los datos después de verificar el OTP
router.post("/save-patient-after-otp", async (req, res) => {
    try {
        const { email } = req.body;

        console.log("ID de sesión en /save-patient-after-otp:", req.sessionID);
        console.log("Datos en sesión:", req.session.tempUserData);

        if (!req.session.tempUserData || req.session.tempUserData.email !== email) {
            return res.status(400).json({ message: "Datos temporales no encontrados o inválidos" });
        }

        const {
            nombre,
            apellido,
            telefono,
            fechaNacimiento,
            calle,
            numeroExterior,
            entreCalle1,
            entreCalle2,
            codigoPostal,
            asentamiento,
            municipio,
            estado,
            pais,
            alergias,
            antecedentes_medicos,
            email: storedEmail,
            contrasena,
            foto,
            fotoMimeType,
            nombreFoto,
        } = req.session.tempUserData;

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Insertar en la tabla usuarios
        const [usuarioResult] = await db.query(
            "INSERT INTO usuarios (email, contrasena, id_rol) VALUES (?, ?, 1)",
            [storedEmail, hashedPassword]
        );
        const usuarioId = usuarioResult.insertId;

        // Construir la ruta de la foto
        const fotoPath = foto ? path.join("uploads", foto) : null;

        // Insertar en la tabla pacientes
        const pacienteQuery = `
      INSERT INTO pacientes (
        id_usuario, nombre, apellido, telefono, fechaNacimiento, calle, numeroExterior, 
        entreCalle1, entreCalle2, codigoPostal, asentamiento, municipio, estado, pais, 
        alergias, antecedentes_medicos, foto, fotoMimeType, nombreFoto, pathFoto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await db.query(pacienteQuery, [
            usuarioId,
            nombre,
            apellido,
            telefono,
            fechaNacimiento || null,
            calle,
            numeroExterior,
            entreCalle1,
            entreCalle2,
            codigoPostal,
            asentamiento,
            municipio,
            estado,
            pais,
            alergias,
            antecedentes_medicos,
            foto,
            fotoMimeType,
            nombreFoto,
            fotoPath,
        ]);

        // Limpiar la sesión
        delete req.session.tempUserData;

        res.status(201).json({ message: "Paciente registrado exitosamente" });
    } catch (error) {
        console.error("Error en /save-patient-after-otp:", error);
        res.status(500).json({ message: "Error al guardar los datos del paciente" });
    }
});

// Ruta para obtener dirección por código postal
router.get("/codigo-postal/:cp", async (req, res) => {

    const { cp } = req.params;
    const apiKey = process.env.TAU_API_KEY;

    try {
        const response = await fetch(`https://api.tau.com.mx/dipomex/v1/codigo_postal?cp=${cp}`, {
            method: "GET",
            headers: {
                "APIKEY": apiKey,
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error desde la API externa: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        const formattedData = {
            error: data.error || false,
            message: data.message || "Procesamiento correcto",
            codigo_postal: {
                estado: data.codigo_postal?.estado || "",
                estado_abreviatura: data.codigo_postal?.estado_abreviatura || "",
                municipio: data.codigo_postal?.municipio || "",
                codigo_postal: data.codigo_postal?.codigo_postal || cp,
                colonias: data.codigo_postal?.colonias || [],
            },
        };
        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error detallado en /api/codigo-postal:", error.message);
        res.status(500).json({
            error: true,
            message: "Error al consultar la API de código postal: " + error.message,
            codigo_postal: {},
        });
    }
});


router.get('/getAllDoctors', async (req, res) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const [doctors] = await db.query(
            `SELECT * from medicos`
        );

        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error al obtener los médicos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los médicos.' });
    }
});

router.post('/createAppointment', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);



    const { id_paciente, id_medico, fecha_consulta, hora_consulta, motivo, estado } = req.body;



    // Validar que todos los campos necesarios estén presentes
    if (!id_paciente || !id_medico || !fecha_consulta || !hora_consulta || !motivo || !estado) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }


    // Verificar que el id_paciente coincida con el usuario autenticado
    if (id_paciente !== decoded.id) {
        return res.status(403).json({ message: 'No puedes crear citas para otro usuario' });
    }

    const [searchIdPaciente] = await db.query("SELECT id_paciente FROM pacientes where id_usuario = ?", decoded.id);

    if (searchIdPaciente === 0) {
        return res.status(404).json({ message: "Paciente no encontrado" });
    }




    try {

        const [result] = await db.query(
            'INSERT INTO consultas (id_paciente, id_medico, fecha_consulta, hora_consulta, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [searchIdPaciente[0].id_paciente, id_medico, fecha_consulta, hora_consulta, motivo, estado]
        );


        res.status(201).json({ message: 'Cita creada exitosamente', appointmentId: result.insertId });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
export default router;