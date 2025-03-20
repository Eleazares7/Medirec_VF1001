import express from "express";
import db from "../Config/db.js";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from 'url';
import axios from 'axios';
import jwt from "jsonwebtoken"


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_aqui";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });


router.get("/patient/:email", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = req.params.email;

        // Verifica que el token coincida con el email solicitado
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
        console.log("Datos enviados al frontend:", patient); // Depura qué se envía
        res.status(200).json(patient);
    } catch (error) {
        console.error("Error al obtener datos del paciente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post('/register-patient', upload.single('foto'),
    async (req, res) => {
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
            } = req.body;

            const foto = req.file ? req.file.filename : null;
            const fotoMimeType = req.file ? req.file.mimetype : null;

            if (contrasena !== confirmarContrasena) {
                return res.status(400).json({ message: 'Las contraseñas no coinciden' });
            }

            // Llamar al endpoint 2fa/send para enviar OTP
            const otpResponse = await axios.post('http://localhost:5000/2fa/send', { email });

            // Error al mandar el OTP
            if (!otpResponse.data.success) {
                return res.status(400).json({ message: otpResponse.data.message || 'Error al enviar el OTP' });
            }

            // Guardar datos en la sesión solo si el OTP se envía correctamente
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
                foto,
                fotoMimeType,
            };

            res.status(200).json({
                message: 'OTP enviado. Por favor, verifica tu correo.',
                redirectTo: '/otpScreen'
            });

        } catch (error) {
            console.error('Error en /users/register-patient:', error);
            res.status(500).json({ message: 'Error al procesar la solicitud' });
        }
    });

router.post('/save-patient-after-otp', async (req, res) => {
    try {
        const { email } = req.body;



        console.log('ID de sesión en /save-patient-after-otp:', req.sessionID);
        console.log('Datos en sesión:', req.session.tempUserData);

        if (!req.session.tempUserData || req.session.tempUserData.email !== email) {
            return res.status(400).json({ error: 'Datos temporales no encontrados o inválidos' });
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
        } = req.session.tempUserData;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        const usuarioQuery = `
            INSERT INTO usuarios (email, contrasena, id_rol)
            VALUES (?, ?, '1')
        `;
        const [usuarioResult] = await db.query(usuarioQuery, [
            storedEmail,
            hashedPassword,
        ]);

        const usuarioId = usuarioResult.insertId;

        const pacienteQuery = `
            INSERT INTO pacientes (id_paciente, id_usuario,nombre,apellido, telefono,fechaNacimiento,calle,numeroExterior,entreCalle1,entreCalle2,codigoPostal,asentamiento,municipio,estado,pais,alergias,antecedentes_medicos, foto, fotoMimeType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(pacienteQuery, [
            usuarioId,
            usuarioId,
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
            foto,
            fotoMimeType
        ]);

        delete req.session.tempUserData;
        res.status(201).json({ message: 'Paciente registrado exitosamente' });
    } catch (error) {
        console.error('Error en /save-patient-after-otp:', error);
        res.status(500).json({ error: 'Error al guardar los datos del paciente' });
    }
});

//Ruta para obtener dirección a traves de código postal
router.get('/codigo-postal/:cp', async (req, res) => {
    const { cp } = req.params;
    const apiKey = process.env.TAU_API_KEY;

    try {
        const response = await fetch(`https://api.tau.com.mx/dipomex/v1/codigo_postal?cp=${cp}`, {
            method: 'GET',
            headers: {
                'APIKEY': apiKey,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error desde la API externa: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Formatear la respuesta para que sea consistente con lo que esperamos
        const formattedData = {
            error: data.error || false,
            message: data.message || 'Procesamiento correcto',
            codigo_postal: {
                estado: data.codigo_postal?.estado || '',
                estado_abreviatura: data.codigo_postal?.estado_abreviatura || '',
                municipio: data.codigo_postal?.municipio || '',
                codigo_postal: data.codigo_postal?.codigo_postal || cp,
                colonias: data.codigo_postal?.colonias || []  // Array de colonias, vacío si no hay
            }
        };
        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error detallado en /api/codigo-postal:', error.message);
        res.status(500).json({
            error: true,
            message: 'Error al consultar la API de código postal: ' + error.message,
            codigo_postal: {}
        });
    }
});

export default router;