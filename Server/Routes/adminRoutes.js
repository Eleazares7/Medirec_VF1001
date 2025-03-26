import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.js'; // Asegúrate de que este archivo exporte tu conexión a la base de datos
import multer from 'multer';
import bcrypt from 'bcrypt';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_aqui";

// Configuración de Multer para manejar archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Obtener datos administrador
router.get("/getAdmin/:email", async (req, res) => {
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
            `SELECT u.id_usuario, u.email, u.contrasena, u.id_rol, u.fecha_registro, 
                    a.id_administrador, a.nombre, a.apellido, a.telefono, a.fecha_inicio, a.estado 
             FROM usuarios u 
             INNER JOIN administradores a ON u.id_usuario = a.id_usuario 
             WHERE u.id_usuario = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Administrador no encontrado" });
        }

        const admin = rows[0];
        res.status(200).json(admin);
    } catch (error) {
        console.error("Error al obtener datos del administrador:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta para registrar un doctor
router.post("/registerDoctor", upload.single('foto'), async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1] || "No token provided";

    if (!token || token === "No token provided") {
        return res.status(401).json({ success: false, message: "No se proporcionó token" });
    }

    try {
        const { email, contrasena, confirmarContrasena, nombre, apellido, especialidad, numero_licencia, adminEmail, horarios } = req.body;
        const foto = req.file;

        // Validar campos obligatorios del doctor
        if (!email || !contrasena || !confirmarContrasena || !nombre || !apellido || !especialidad || !numero_licencia || !adminEmail) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios. Asegúrate de completar todos los campos." });
        }

        if (!foto) {
            return res.status(400).json({ success: false, message: "La foto es obligatoria." });
        }

        // Validar contraseña
        if (contrasena !== confirmarContrasena) {
            return res.status(400).json({ success: false, message: "Las contraseñas no coinciden." });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial (por ejemplo, !@#$%^&*()).",
            });
        }

        // Validar número de licencia
        const numeroLicenciaRegex = /^\d{10}$/;
        if (!numeroLicenciaRegex.test(numero_licencia)) {
            return res.status(400).json({ success: false, message: "El número de licencia debe tener exactamente 10 dígitos." });
        }

        // Validar formato del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "El correo electrónico no tiene un formato válido." });
        }

        // Parsear y validar los horarios
        let horariosArray = [];
        if (horarios) {
            try {
                horariosArray = JSON.parse(horarios);
                if (!Array.isArray(horariosArray)) {
                    return res.status(400).json({ success: false, message: "Los horarios deben ser un arreglo." });
                }

                for (const horario of horariosArray) {
                    const { dia_semana, fecha, hora_inicio, hora_fin, estado } = horario;

                    // Validar campos obligatorios
                    if (!dia_semana && !fecha) {
                        return res.status(400).json({ success: false, message: "Debe especificar un día de la semana o una fecha para cada horario." });
                    }

                    if (!hora_inicio || !hora_fin) {
                        return res.status(400).json({ success: false, message: "La hora de inicio y la hora de fin son obligatorias para cada horario." });
                    }

                    // Validar formato de las horas
                    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                    if (!timeRegex.test(hora_inicio) || !timeRegex.test(hora_fin)) {
                        return res.status(400).json({ success: false, message: "Las horas deben estar en formato HH:MM (24 horas)." });
                    }

                    // Validar que la hora de inicio sea anterior a la hora de fin
                    const inicio = new Date(`1970-01-01T${hora_inicio}:00`);
                    const fin = new Date(`1970-01-01T${hora_fin}:00`);
                    if (inicio >= fin) {
                        return res.status(400).json({ success: false, message: "La hora de inicio debe ser anterior a la hora de fin en cada horario." });
                    }

                    // Validar fecha si está presente
                    if (fecha) {
                        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
                        if (!fechaRegex.test(fecha)) {
                            return res.status(400).json({ success: false, message: "La fecha debe estar en formato YYYY-MM-DD." });
                        }
                        const fechaDate = new Date(fecha);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (fechaDate < today) {
                            return res.status(400).json({ success: false, message: "La fecha no puede ser anterior a la fecha actual." });
                        }
                    }

                    // Validar estado
                    const validEstados = ['Disponible', 'Reservado', 'Cancelado'];
                    if (estado && !validEstados.includes(estado)) {
                        return res.status(400).json({ success: false, message: 'El estado del horario debe ser "Disponible", "Reservado" o "Cancelado".' });
                    }
                }
            } catch (error) {
                return res.status(400).json({ success: false, message: "Error al procesar los horarios: " + error.message });
            }
        }

        // Verificar si el usuario ya existe
        const [existingUser] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: "El correo ya está registrado." });
        }

        // Iniciar transacción
        await db.query("START TRANSACTION");

        try {
            // Registrar el usuario (rol 2 = doctor)
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            const [userResult] = await db.query(
                "INSERT INTO usuarios (email, contrasena, id_rol, fecha_registro) VALUES (?, ?, ?, NOW())",
                [email, hashedPassword, 2]
            );
            const id_usuario = userResult.insertId;

            // Registrar el doctor
            const [doctorResult] = await db.query(
                "INSERT INTO medicos (id_usuario, nombre, apellido, especialidad, numero_licencia, foto, foto_mime_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [id_usuario, nombre, apellido, especialidad, numero_licencia, foto.buffer, foto.mimetype]
            );
            const id_medico = doctorResult.insertId;

            // Registrar los horarios
            if (horariosArray.length > 0) {
                for (const horario of horariosArray) {
                    await db.query(
                        "INSERT INTO horarios_medicos (id_medico, dia_semana, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)",
                        [
                            id_medico,
                            horario.dia_semana || null,
                            horario.fecha || null,
                            horario.hora_inicio,
                            horario.hora_fin,
                            horario.estado || 'Disponible',
                        ]
                    );
                }
            }

            // Confirmar transacción
            await db.query("COMMIT");
            res.status(201).json({ success: true, message: "Doctor registrado exitosamente." });
        } catch (error) {
            await db.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Error al registrar el doctor:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor al registrar el doctor.", error: error.message });
    }
});


router.get("/users/getDoctors", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Obtener los datos de los doctores
        const [doctors] = await db.query(
            `SELECT u.id_usuario, u.email, m.id_medico, m.nombre, m.apellido, m.especialidad, m.numero_licencia, m.foto, m.foto_mime_type
             FROM usuarios u
             INNER JOIN medicos m ON u.id_usuario = m.id_usuario
             WHERE u.id_rol = ?`,
            [2]
        );

        if (doctors.length === 0) {
            return res.status(200).json([]);
        }

        // Obtener los horarios de cada doctor
        const doctorsWithDetails = await Promise.all(
            doctors.map(async (doctor) => {
                // Obtener los horarios del doctor
                const [horarios] = await db.query(
                    `SELECT id_horario, dia_semana, fecha, hora_inicio, hora_fin, estado
                     FROM horarios_medicos
                     WHERE id_medico = ?`,
                    [doctor.id_medico]
                );

                // Convertir la foto a base64
                const photoBase64 = doctor.foto ? Buffer.from(doctor.foto).toString('base64') : null;
                const photoUrl = photoBase64 ? `data:${doctor.foto_mime_type};base64,${photoBase64}` : null;

                return {
                    id: doctor.id_medico,
                    nombre: doctor.nombre,
                    apellido: doctor.apellido,
                    especialidad: doctor.especialidad,
                    email: doctor.email,
                    numero_licencia: doctor.numero_licencia,
                    foto: photoUrl,
                    horarios: horarios.map(horario => ({
                        id_horario: horario.id_horario,
                        dia_semana: horario.dia_semana,
                        fecha: horario.fecha ? horario.fecha.toISOString().split('T')[0] : null, // Formato YYYY-MM-DD
                        hora_inicio: horario.hora_inicio,
                        hora_fin: horario.hora_fin,
                        estado: horario.estado,
                    })),
                };
            })
        );
        console.log(doctorsWithDetails);

        res.status(200).json(doctorsWithDetails);
    } catch (error) {
        console.error("Error al obtener la lista de doctores:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la lista de doctores." });
    }
});

// Actualizar un doctor
router.put("/users/updateDoctor", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { id, nombre, apellido, especialidad, email, numero_licencia, horarios } = req.body;

        // Validar que se proporcione el ID del doctor
        if (!id) {
            return res.status(400).json({ success: false, message: "El ID del doctor es requerido" });
        }

        // Verificar si el doctor existe
        const [checkDoctor] = await db.query(
            `SELECT m.id_medico, m.id_usuario 
             FROM medicos m 
             INNER JOIN usuarios u ON m.id_usuario = u.id_usuario 
             WHERE m.id_medico = ?`,
            [id]
        );
        if (checkDoctor.length === 0) {
            return res.status(404).json({ success: false, message: "Doctor no encontrado" });
        }

        const id_usuario = checkDoctor[0].id_usuario;

        // Validar los campos proporcionados
        if (!nombre && !apellido && !especialidad && !email && !numero_licencia && !horarios) {
            return res.status(400).json({ success: false, message: "No se proporcionaron datos para actualizar" });
        }

        // Validar formato del email si se proporciona
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "El correo electrónico no tiene un formato válido" });
            }

            // Verificar si el email ya está registrado por otro usuario
            const [checkEmail] = await db.query(
                "SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?",
                [email, id_usuario]
            );
            if (checkEmail.length > 0) {
                return res.status(400).json({ success: false, message: "El correo ya está registrado por otro usuario" });
            }
        }

        // Validar número de licencia si se proporciona
        if (numero_licencia) {
            const numeroLicenciaRegex = /^\d{10}$/;
            if (!numeroLicenciaRegex.test(numero_licencia)) {
                return res.status(400).json({ success: false, message: "El número de licencia debe tener exactamente 10 dígitos" });
            }
        }

        // Validar que los campos de texto no estén vacíos o solo contengan espacios
        if (nombre && !nombre.trim()) {
            return res.status(400).json({ success: false, message: "El nombre no puede estar vacío" });
        }
        if (apellido && !apellido.trim()) {
            return res.status(400).json({ success: false, message: "El apellido no puede estar vacío" });
        }
        if (especialidad && !especialidad.trim()) {
            return res.status(400).json({ success: false, message: "La especialidad no puede estar vacía" });
        }

        // Validar horarios si se proporcionan
        if (horarios) {
            if (!Array.isArray(horarios)) {
                return res.status(400).json({ success: false, message: "Los horarios deben ser un arreglo" });
            }

            for (const horario of horarios) {
                // Validar que se proporcione un día de la semana o una fecha
                if (!horario.dia_semana && !horario.fecha) {
                    return res.status(400).json({ success: false, message: "Debe especificar un día de la semana o una fecha para cada horario" });
                }

                // Validar que se proporcionen hora de inicio y fin
                if (!horario.hora_inicio || !horario.hora_fin) {
                    return res.status(400).json({ success: false, message: "La hora de inicio y la hora de fin son obligatorias para cada horario" });
                }

                // Validar formato de las horas
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
                if (!timeRegex.test(horario.hora_inicio) || !timeRegex.test(horario.hora_fin)) {
                    return res.status(400).json({ success: false, message: "Las horas deben estar en formato HH:MM o HH:MM:SS (24 horas)" });
                }

                // Validar que la hora de inicio sea anterior a la hora de fin
                const inicio = new Date(`1970-01-01T${horario.hora_inicio}`);
                const fin = new Date(`1970-01-01T${horario.hora_fin}`);
                if (inicio >= fin) {
                    return res.status(400).json({ success: false, message: "La hora de inicio debe ser anterior a la hora de fin en cada horario" });
                }

                // Validar formato de la fecha si se proporciona
                if (horario.fecha) {
                    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!fechaRegex.test(horario.fecha)) {
                        return res.status(400).json({ success: false, message: "La fecha debe estar en formato YYYY-MM-DD" });
                    }
                    const fechaDate = new Date(horario.fecha);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (fechaDate < today) {
                        return res.status(400).json({ success: false, message: "La fecha no puede ser anterior a la fecha actual" });
                    }
                }

                // Validar el estado del horario
                const validEstados = ['Disponible', 'Reservado', 'Cancelado'];
                if (horario.estado && !validEstados.includes(horario.estado)) {
                    return res.status(400).json({ success: false, message: 'El estado del horario debe ser "Disponible", "Reservado" o "Cancelado"' });
                }
            }
        }

        // Iniciar transacción
        await db.query("START TRANSACTION");

        try {
            // Actualizar el email en la tabla usuarios si se proporciona
            if (email) {
                await db.query(
                    "UPDATE usuarios SET email = ? WHERE id_usuario = ?",
                    [email, id_usuario]
                );
            }

            // Construir la consulta para actualizar la tabla medicos
            let queryMedicos = 'UPDATE medicos SET ';
            const valuesMedicos = [];
            let hasUpdates = false;

            if (nombre) {
                queryMedicos += `nombre = ?, `;
                valuesMedicos.push(nombre.trim());
                hasUpdates = true;
            }
            if (apellido) {
                queryMedicos += `apellido = ?, `;
                valuesMedicos.push(apellido.trim());
                hasUpdates = true;
            }
            if (especialidad) {
                queryMedicos += `especialidad = ?, `;
                valuesMedicos.push(especialidad.trim());
                hasUpdates = true;
            }
            if (numero_licencia) {
                queryMedicos += `numero_licencia = ?, `;
                valuesMedicos.push(numero_licencia);
                hasUpdates = true;
            }

            // Si hay datos para actualizar en la tabla medicos, ejecutar la consulta
            if (hasUpdates) {
                queryMedicos = queryMedicos.slice(0, -2); // Quitar la última coma y espacio
                queryMedicos += ` WHERE id_medico = ?`;
                valuesMedicos.push(id);
                await db.query(queryMedicos, valuesMedicos);
            }

            // Actualizar los horarios si se proporcionan
            if (horarios) {
                // Eliminar los horarios existentes
                await db.query("DELETE FROM horarios_medicos WHERE id_medico = ?", [id]);

                // Insertar los nuevos horarios
                if (horarios.length > 0) {
                    for (const horario of horarios) {
                        await db.query(
                            "INSERT INTO horarios_medicos (id_medico, dia_semana, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)",
                            [
                                id,
                                horario.dia_semana || null,
                                horario.fecha || null,
                                horario.hora_inicio,
                                horario.hora_fin,
                                horario.estado || 'Disponible',
                            ]
                        );
                    }
                }
            }

            // Obtener los datos actualizados del doctor, incluyendo los horarios
            const [updatedDoctor] = await db.query(
                `SELECT u.id_usuario, u.email, m.id_medico, m.nombre, m.apellido, m.especialidad, m.numero_licencia, m.foto, m.foto_mime_type
                 FROM usuarios u
                 INNER JOIN medicos m ON u.id_usuario = m.id_usuario
                 WHERE m.id_medico = ?`,
                [id]
            );

            if (updatedDoctor.length === 0) {
                throw new Error("No se pudo obtener los datos actualizados del doctor");
            }

            const doctor = updatedDoctor[0];
            const photoBase64 = doctor.foto ? Buffer.from(doctor.foto).toString('base64') : null;
            const photoUrl = photoBase64 ? `data:${doctor.foto_mime_type};base64,${photoBase64}` : null;

            // Obtener los horarios actualizados
            const [horariosDoctor] = await db.query(
                `SELECT id_horario, dia_semana, fecha, hora_inicio, hora_fin, estado
                 FROM horarios_medicos
                 WHERE id_medico = ?`,
                [id]
            );

            const doctorResponse = {
                id: doctor.id_medico,
                nombre: doctor.nombre,
                apellido: doctor.apellido,
                especialidad: doctor.especialidad,
                email: doctor.email,
                numero_licencia: doctor.numero_licencia,
                foto: photoUrl,
                horarios: horariosDoctor.map(horario => ({
                    id_horario: horario.id_horario,
                    dia_semana: horario.dia_semana,
                    fecha: horario.fecha ? horario.fecha.toISOString().split('T')[0] : null,
                    hora_inicio: horario.hora_inicio,
                    hora_fin: horario.hora_fin,
                    estado: horario.estado,
                })),
            };

            // Confirmar transacción
            await db.query("COMMIT");

            res.status(200).json({
                success: true,
                message: 'Doctor actualizado correctamente',
                doctor: doctorResponse,
            });
        } catch (error) {
            await db.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Error al actualizar el doctor:", error);
        const statusCode = error.message.includes("no encontrado") ? 404 : 500;
        res.status(statusCode).json({ success: false, message: error.message || "Error interno del servidor al actualizar el doctor" });
    }
});

// Eliminar un doctor
router.delete("/users/deleteDoctor", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "El ID del doctor es requerido" });
        }

        // Verificar si el doctor existe
        const [checkDoctor] = await db.query(
            `SELECT m.id_medico, m.id_usuario 
             FROM medicos m 
             INNER JOIN usuarios u ON m.id_usuario = u.id_usuario 
             WHERE m.id_medico = ?`,
            [id]
        );
        if (checkDoctor.length === 0) {
            return res.status(404).json({ message: "Doctor no encontrado" });
        }

        const id_usuario = checkDoctor[0].id_usuario;

        // Iniciar una transacción para eliminar de ambas tablas
        await db.query("START TRANSACTION");

        try {
            // Eliminar de la tabla medicos
            await db.query("DELETE FROM medicos WHERE id_medico = ?", [id]);

            // Eliminar de la tabla usuarios
            await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id_usuario]);

            // Confirmar la transacción
            await db.query("COMMIT");

            res.json({ message: "Doctor eliminado correctamente" });
        } catch (error) {
            // Revertir la transacción en caso de error
            await db.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Error al eliminar el doctor:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar el doctor." });
    }
});

router.post('/medicine/addMedicine', upload.single('foto'), async (req, res) => {
    console.log("Sí llegó a /admin/medicine/addMedicine");
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const {
            nombre, descripcion, precio, stock, categoria, contenido_neto, unidad_medida, presentacion,
            requiere_receta, es_antibiotioco, indicaciones, contraindicaciones, fecha_vencimiento, lote, proveedor, estado, adminEmail
        } = req.body;

        const foto = req.file ? {
            foto_data: req.file.buffer,
            foto_mime_type: req.file.mimetype,
        } : { foto_data: null, foto_mime_type: null };

        // Query para insertar el medicamento
        const query = `
            INSERT INTO Medicamentos (
                nombre, descripcion, precio, stock, foto, foto_mime_type, categoria, contenido_neto, 
                unidad_medida, presentacion, requiere_receta, es_antibiotioco, indicaciones, contraindicaciones, 
                fecha_vencimiento, lote, proveedor, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nombre,
            descripcion || null,
            parseFloat(precio),
            parseInt(stock),
            foto.foto_data,
            foto.foto_mime_type,
            categoria,
            contenido_neto || null,
            unidad_medida || null,
            presentacion || null,
            requiere_receta === 'true', // Convertimos a booleano
            es_antibiotioco === 'true', // Convertimos a booleano
            indicaciones || null,
            contraindicaciones || null,
            fecha_vencimiento || null,
            lote || null,
            proveedor || null,
            estado || 'Activo'
        ];

        // Ejecutar la inserción usando tu db importada
        const [result] = await db.execute(query, values); // Usamos db directamente

        // Respuesta exitosa
        res.status(201).json({
            message: 'Medicamento registrado exitosamente',
            id_medicamento: result.insertId
        });
    } catch (error) {
        console.error('Error al registrar el medicamento:', error);
        res.status(500).json({ message: error.message || 'Error al registrar el medicamento' });
    }
});


router.get('/users/reportDoctors', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Obtener todos los médicos con sus horarios
        const [doctors] = await db.query(
            `SELECT u.id_usuario, u.email, m.id_medico, m.nombre, m.apellido, m.especialidad, m.numero_licencia, m.foto, m.foto_mime_type
             FROM usuarios u
             INNER JOIN medicos m ON u.id_usuario = m.id_usuario`
        );

        // Obtener los horarios de cada médico
        for (let doctor of doctors) {
            const [horarios] = await db.query(
                `SELECT id_horario, dia_semana, fecha, hora_inicio, hora_fin, estado
                 FROM horarios_medicos
                 WHERE id_medico = ?`,
                [doctor.id_medico]
            );
            doctor.horarios = horarios.map((horario) => ({
                id_horario: horario.id_horario,
                dia_semana: horario.dia_semana,
                fecha: horario.fecha ? horario.fecha.toISOString().split('T')[0] : null,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
                estado: horario.estado,
            }));

            // Convertir la foto a base64
            const photoBase64 = doctor.foto ? Buffer.from(doctor.foto).toString('base64') : null;
            doctor.foto = photoBase64 ? `data:${doctor.foto_mime_type};base64,${photoBase64}` : null;
        }

        res.status(200).json({
            success: true,
            doctors,
        });
    } catch (error) {
        console.error('Error al obtener los médicos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

export default router;