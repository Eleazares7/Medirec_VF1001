// server.js
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch'; // Necesitamos node-fetch para hacer solicitudes HTTP desde el backend

const app = express();

// Configurar middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Conexión a la base de datos MySQL
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

try {
    await db.connect();
    console.log('Conectado a la base de datos MySQL');
} catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
}

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: '¡Servidor funcionando correctamente!' });
});

// Nueva ruta para consultar el código postal (proxy)
// server.js (fragmento de la ruta /api/codigo-postal/:cp)

// server.js (modifica la ruta /api/codigo-postal/:cp)
app.get('/api/codigo-postal/:cp', async (req, res) => {
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
// Ruta para registrar un paciente

// server.js (modifica la ruta /api/register-patient)
// server.js (modifica la ruta /api/register-patient)
app.post('/api/register-patient', upload.single('foto'), async (req, res) => {
    try {
        const {
            nombre,
            telefono,
            edad,
            fechaNacimiento,   // Nuevo campo
            direccion,
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

        const foto = req.file ? req.file.buffer : null;
        const fotoMimeType = req.file ? req.file.mimetype : null;

        if (contrasena !== confirmarContrasena) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        const usuarioQuery = `
      INSERT INTO usuarios (email, contrasena, rol, nombre, foto_url, foto_mime_type, telefono)
      VALUES (?, ?, 'paciente', ?, ?, ?, ?)
    `;
        const [usuarioResult] = await db.execute(usuarioQuery, [
            email,
            hashedPassword,
            nombre,
            foto,
            fotoMimeType,
            telefono,
        ]);

        const usuarioId = usuarioResult.insertId;

        const pacienteQuery = `
      INSERT INTO pacientes (id, edad, fecha_nacimiento, direccion, calle, numero_exterior, entre_calle_1, entre_calle_2, codigo_postal, asentamiento, municipio, estado, pais, alergias, antecedentes_medicos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await db.execute(pacienteQuery, [
            usuarioId,
            edad,
            fechaNacimiento,  // Nuevo campo
            direccion,
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
        ]);

        res.status(201).json({ message: 'Paciente registrado exitosamente' });
    } catch (error) {
        console.error('Error en /api/register-patient:', error);
        res.status(500).json({ error: 'Error al registrar el paciente' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});