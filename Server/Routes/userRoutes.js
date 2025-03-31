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
import { log } from "console";

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

        console.log(patient);

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
        log

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

router.put('/updatePatient/:email', upload.single('foto'), async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    const { email } = req.params;
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
        nombreFoto,
        pathFoto,
    } = req.body;

    const foto = req.file ? req.file.buffer : null;
    const fotoMimeType = req.file ? req.file.mimetype : null;

    try {
        // 1. Buscar el id_usuario en la tabla usuarios usando el email
        const [user] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const id_usuario = user[0].id_usuario;

        // 2. Buscar el paciente en la tabla pacientes usando el id_usuario
        const [patient] = await db.query('SELECT id_paciente FROM pacientes WHERE id_usuario = ?', [id_usuario]);

        if (!patient || patient.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const id_paciente = patient[0].id_paciente;

        // 3. Construir el objeto de actualización con los campos que se enviaron
        const updateData = {};
        const updateParams = [];

        // Lista de campos que se pueden actualizar
        const fields = {
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
            nombreFoto,
            pathFoto,
        };

        // Añadir solo los campos que no son undefined al objeto de actualización
        for (const [key, value] of Object.entries(fields)) {
            if (value !== undefined) {
                updateData[key] = value;
                updateParams.push(value);
            }
        }

        // Manejar la foto y sus campos relacionados
        if (foto) {
            updateData.foto = foto;
            updateData.fotoMimeType = fotoMimeType;
            updateParams.push(foto, fotoMimeType);
        }

        // Si no hay datos para actualizar, devolver un mensaje
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        // 4. Construir la consulta SQL dinámicamente
        const setClause = Object.keys(updateData)
            .map((key) => `${key} = ?`)
            .join(', ');
        updateParams.push(id_paciente);

        const query = `UPDATE pacientes SET ${setClause} WHERE id_paciente = ?`;

        // 5. Ejecutar la consulta
        await db.query(query, updateParams);

        // 6. Obtener los datos actualizados del paciente
        const [updatedPatient] = await db.query('SELECT * FROM pacientes WHERE id_paciente = ?', [id_paciente]);

        // 7. Preparar la respuesta con los datos actualizados
        const responseData = {
            id_paciente: updatedPatient[0].id_paciente,
            id_usuario: updatedPatient[0].id_usuario,
            nombre: updatedPatient[0].nombre,
            apellido: updatedPatient[0].apellido,
            telefono: updatedPatient[0].telefono,
            fechaNacimiento: updatedPatient[0].fechaNacimiento,
            calle: updatedPatient[0].calle,
            numeroExterior: updatedPatient[0].numeroExterior,
            entreCalle1: updatedPatient[0].entreCalle1,
            entreCalle2: updatedPatient[0].entreCalle2,
            codigoPostal: updatedPatient[0].codigoPostal,
            asentamiento: updatedPatient[0].asentamiento,
            municipio: updatedPatient[0].municipio,
            estado: updatedPatient[0].estado,
            pais: updatedPatient[0].pais,
            alergias: updatedPatient[0].alergias,
            antecedentes_medicos: updatedPatient[0].antecedentes_medicos,
            nombreFoto: updatedPatient[0].nombreFoto,
            pathFoto: updatedPatient[0].pathFoto,
            fotoMimeType: updatedPatient[0].fotoMimeType,
            // No devolvemos el BLOB directamente, sino que podemos devolver un indicador
            foto: updatedPatient[0].foto ? 'Presente' : 'No presente',
        };

        // 8. Enviar la respuesta al frontend
        res.status(200).json({
            success: true,
            message: 'Paciente actualizado correctamente',
            data: responseData,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el paciente', error: error.message });
    }
});

// Ruta para obtener lista de doctores
router.get('/getAllDoctors', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const [doctors] = await db.query(
            `SELECT medicos.id_medico, medicos.id_usuario, medicos.nombre, medicos.apellido, 
                    horarios_medicos.dia_semana, horarios_medicos.hora_inicio, horarios_medicos.hora_fin 
             FROM medicos 
             LEFT JOIN horarios_medicos ON medicos.id_medico = horarios_medicos.id_medico`
        );

        // Agrupar los horarios por médico
        const doctorsWithSchedules = doctors.reduce((acc, curr) => {
            const doctor = acc.find(d => d.id_medico === curr.id_medico);
            if (doctor) {
                doctor.schedules.push({
                    dia_semana: curr.dia_semana,
                    hora_inicio: curr.hora_inicio,
                    hora_fin: curr.hora_fin
                });
            } else {
                acc.push({
                    id_medico: curr.id_medico,
                    id_usuario: curr.id_usuario,
                    nombre: curr.nombre,
                    apellido: curr.apellido,
                    schedules: curr.dia_semana ? [{
                        dia_semana: curr.dia_semana,
                        hora_inicio: curr.hora_inicio,
                        hora_fin: curr.hora_fin
                    }] : []
                });
            }
            return acc;
        }, []);

        res.status(200).json(doctorsWithSchedules);
    } catch (error) {
        console.error('Error al obtener los médicos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener los médicos.' });
    }
});

/*-------> Ruta para Generar una cita medica <-------*/
router.post('/createAppointment', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    const { id_usuario, id_medico, fecha_consulta, dia_consulta, hora_consulta, motivo, estado } = req.body;

    try {
        // Verificar si ya existe una consulta con el mismo médico, fecha y hora
        const [existingAppointment] = await db.query(
            `SELECT id_consulta 
             FROM consultas 
             WHERE id_medico = ? 
             AND fecha_consulta = ? 
             AND hora_consulta = ?`,
            [id_medico, fecha_consulta, hora_consulta]
        );

        const [getIdPatient] = await db.query(
            `SELECT id_paciente 
             FROM pacientes 
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        if (getIdPatient.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const id_paciente = getIdPatient[0].id_paciente;

        if (existingAppointment.length > 0) {
            return res.status(409).json({
                message: 'El horario seleccionado ya está ocupado para este médico en esa fecha.'
            });
        }

        // Opcional: Validar que dia_consulta coincide con fecha_consulta
        const date = new Date(fecha_consulta);
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const calculatedDay = daysOfWeek[date.getUTCDay()];
        if (calculatedDay !== dia_consulta) {
            return res.status(400).json({
                message: `El día de la semana (${dia_consulta}) no coincide con la fecha (${fecha_consulta}).`
            });
        }

        // Insertar la nueva consulta con dia_consulta
        const [result] = await db.query(
            `INSERT INTO consultas (id_paciente, id_medico, fecha_consulta, dia_consulta, hora_consulta, motivo, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_paciente, id_medico, fecha_consulta, dia_consulta, hora_consulta, motivo, estado]
        );

        res.status(201).json({
            message: 'Cita médica creada exitosamente.',
            id_consulta: result.insertId
        });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la cita.' });
    }
});

/*-------> Ruta para obtener citas por médico y fecha <-------*/
router.get('/getAppointmentsByDoctorAndDate', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    const { id_medico, fecha_consulta, dia_consulta } = req.query;

    console.log("DIA DE CONSULTA: " + dia_consulta);

    try {
        const [appointments] = await db.query(
            `SELECT hora_consulta 
             FROM consultas 
             WHERE id_medico = ? 
             AND fecha_consulta = ?
             AND dia_consulta = ?`,
            [id_medico, fecha_consulta, dia_consulta]
        );

        console.log("CONSULTAS", appointments);


        res.status(200).json(appointments.map(appointment => appointment.hora_consulta));
    } catch (error) {
        console.error('Error al obtener citas existentes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener citas.' });
    }
});

/*-------> Ruta para obtener citas del usuario <-------*/
router.get('/getUserAppointments', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    

    try {
        // Obtener el id_usuario del token (suponiendo que el token contiene esta información)
        const decoded = jwt.verify(token, JWT_SECRET);
        const id_usuario = decoded.id;

        // Obtener el id_paciente asociado al usuario
        const [patient] = await db.query(
            `SELECT id_paciente 
             FROM pacientes 
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        if (patient.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const id_paciente = patient[0].id_paciente;

        // Obtener todas las citas del paciente con los datos del médico
        const [appointments] = await db.query(
            `SELECT c.id_consulta, c.id_medico, c.fecha_consulta, c.dia_consulta, c.hora_consulta, c.motivo, c.estado, 
                    m.nombre AS medico_nombre, m.apellido AS medico_apellido
             FROM consultas c
             JOIN medicos m ON c.id_medico = m.id_medico
             WHERE c.id_paciente = ?
             ORDER BY c.fecha_consulta DESC`,
            [id_paciente]
        );

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error al obtener las citas del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las citas.' });
    }
});


export default router;