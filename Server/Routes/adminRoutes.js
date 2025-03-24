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
        console.log("Datos enviados al frontend:", admin);
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
      return res.status(401).json({ message: "No se proporcionó token" });
    }
  
    try {
      const { email, contrasena, confirmarContrasena, nombre, apellido, especialidad, numero_licencia, adminEmail } = req.body;
      const foto = req.file;
  
      // Validar campos obligatorios
      if (!email || !contrasena || !confirmarContrasena || !nombre || !apellido || !especialidad || !numero_licencia || !adminEmail) {
        return res.status(400).json({ message: "Faltan datos obligatorios. Asegúrate de completar todos los campos." });
      }
  
      if (!foto) {
        return res.status(400).json({ message: "La foto es obligatoria." });
      }
  
      // Validar contraseña
      if (contrasena !== confirmarContrasena) {
        return res.status(400).json({ message: "Las contraseñas no coinciden." });
      }
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
      if (!passwordRegex.test(contrasena)) {
        return res.status(400).json({
          message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial (por ejemplo, !@#$%^&*()).",
        });
      }
  
      // Validar número de licencia
      const numeroLicenciaRegex = /^\d{10}$/;
      if (!numeroLicenciaRegex.test(numero_licencia)) {
        return res.status(400).json({ message: "El número de licencia debe tener exactamente 10 dígitos." });
      }
  
      // Verificar si el usuario ya existe
      const [existingUser] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "El correo ya está registrado." });
      }
  
      // Iniciar transacción
      await db.query("START TRANSACTION");
  
      try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const [userResult] = await db.query(
          "INSERT INTO usuarios (email, contrasena, id_rol, fecha_registro) VALUES (?, ?, ?, NOW())",
          [email, hashedPassword, 2]
        );
  
        const id_usuario = userResult.insertId;
  
        // Guardar la imagen como BLOB
        await db.query(
          "INSERT INTO medicos (id_usuario, nombre, apellido, especialidad, numero_licencia, foto, foto_mime_type) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [id_usuario, nombre, apellido, especialidad, numero_licencia, foto.buffer, foto.mimetype]
        );
  
        await db.query("COMMIT");
        res.status(201).json({ message: "Doctor registrado exitosamente." });
      } catch (error) {
        await db.query("ROLLBACK");
        throw error;
      }
    } catch (error) {
      console.error("Error al registrar el doctor:", error);
      res.status(500).json({ message: "Error interno del servidor al registrar el doctor.", error: error.message });
    }
  });


router.get("/users/getDoctors", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

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

        const doctorsWithPhoto = doctors.map(doctor => {
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
            };
        });

        console.log("Doctores enviados al frontend:", doctorsWithPhoto);
        res.status(200).json(doctorsWithPhoto);
    } catch (error) {
        console.error("Error al obtener la lista de doctores:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la lista de doctores." });
    }
});

// Actualizar un doctor
router.put("/users/updateDoctor", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const { id, nombre, apellido, especialidad, email, numero_licencia } = req.body;

        if (!id) {
            return res.status(400).json({ message: "El ID del doctor es requerido" });
        }

        const [checkDoctor] = await db.query(
            `SELECT m.id_medico 
             FROM medicos m 
             INNER JOIN usuarios u ON m.id_usuario = u.id_usuario 
             WHERE m.id_medico = ?`,
            [id]
        );
        if (checkDoctor.length === 0) {
            return res.status(404).json({ message: "Doctor no encontrado" });
        }

        let queryMedicos = 'UPDATE medicos SET ';
        const valuesMedicos = [];
        let paramCount = 1;

        if (nombre) {
            queryMedicos += `nombre = ?, `;
            valuesMedicos.push(nombre);
            paramCount++;
        }
        if (apellido) {
            queryMedicos += `apellido = ?, `;
            valuesMedicos.push(apellido);
            paramCount++;
        }
        if (especialidad) {
            queryMedicos += `especialidad = ?, `;
            valuesMedicos.push(especialidad);
            paramCount++;
        }
        if (numero_licencia) {
            queryMedicos += `numero_licencia = ?, `;
            valuesMedicos.push(numero_licencia);
            paramCount++;
        }

        if (email) {
            const [checkEmail] = await db.query("SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != (SELECT id_usuario FROM medicos WHERE id_medico = ?)", [email, id]);
            if (checkEmail.length > 0) {
                return res.status(400).json({ message: "El correo ya está registrado por otro usuario." });
            }

            await db.query(
                "UPDATE usuarios SET email = ? WHERE id_usuario = (SELECT id_usuario FROM medicos WHERE id_medico = ?)",
                [email, id]
            );
        }

        if (valuesMedicos.length > 0) {
            queryMedicos = queryMedicos.slice(0, -2); // Quitar la última coma y espacio
            queryMedicos += ` WHERE id_medico = ?`;
            valuesMedicos.push(id);
            await db.query(queryMedicos, valuesMedicos);
        }

        const [updatedDoctor] = await db.query(
            `SELECT u.id_usuario, u.email, m.id_medico, m.nombre, m.apellido, m.especialidad, m.numero_licencia, m.foto, m.foto_mime_type
             FROM usuarios u
             INNER JOIN medicos m ON u.id_usuario = m.id_usuario
             WHERE m.id_medico = ?`,
            [id]
        );

        const doctor = updatedDoctor[0];
        const photoBase64 = doctor.foto ? Buffer.from(doctor.foto).toString('base64') : null;
        const photoUrl = photoBase64 ? `data:${doctor.foto_mime_type};base64,${photoBase64}` : null;

        const doctorResponse = {
            id: doctor.id_medico,
            nombre: `${doctor.nombre} ${doctor.apellido}`,
            especialidad: doctor.especialidad,
            email: doctor.email,
            numero_licencia: doctor.numero_licencia,
            foto: photoUrl,
        };

        res.json({
            message: 'Doctor actualizado correctamente',
            doctor: doctorResponse
        });
    } catch (error) {
        console.error("Error al actualizar el doctor:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar el doctor." });
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


export default router;