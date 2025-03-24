// Routes/homeRoutes.js
import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Endpoint para obtener todos los medicamentos
router.get('/getMedicines', async (req, res) => {
    try {
        const query = `
            SELECT * FROM medicamentos   WHERE estado = 'Activo'
        `;

        const [medicines] = await db.execute(query);

        if (medicines.length === 0) {
            return res.status(200).json([]);
        }

        console.log("Medicamentos enviados al frontend:", medicines);
        res.status(200).json(medicines);
    } catch (error) {
        console.error("Error al obtener la lista de medicamentos:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la lista de medicamentos." });
    }
});

export default router;