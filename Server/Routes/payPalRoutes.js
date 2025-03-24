import express from 'express';
import pkg from '@paypal/checkout-server-sdk';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

const { core, orders } = pkg;
const { OrdersCreateRequest, OrdersCaptureRequest } = orders;

const environment = new core.SandboxEnvironment(
    'AZHoktB7ICTbiaqk7TXB_moLDgIN5Vo5vjc2StdbwiuyuOLLHxZ234Oh0-2-I14iC6hWr7-NXV_BIpl5',
    'EJRSnRl7eOf8-O-6x5QBDxmNtdvOKLGviBOmhGmNddFra-p8Krh7FsqOgulnrh2yANhAJYYz5XEUyvcr'
);
const client = new core.PayPalHttpClient(environment);

const router = express.Router();

// Crear orden de PayPal
router.post('/create-order', async (req, res) => {
    try {
        const { total } = req.body;
        if (!total || isNaN(total) || total <= 0) {
            return res.status(400).json({ error: 'Monto total inválido' });
        }

        const request = new OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'MXN',
                    value: total.toFixed(2),
                },
            }],
        });

        const response = await client.execute(request);
        res.json({ orderID: response.result.id });
    } catch (error) {
        console.error('Error al crear orden de PayPal:', error);
        res.status(500).json({ error: 'Error al crear la orden' });
    }
});

// Capturar orden de PayPal
router.post('/capture-order', async (req, res) => {
    try {
        const { orderID } = req.body;
        if (!orderID) {
            return res.status(400).json({ error: 'OrderID requerido' });
        }

        const request = new OrdersCaptureRequest(orderID);
        request.requestBody({});

        const response = await client.execute(request);
        res.json({ status: response.result.status });
    } catch (error) {
        console.error('Error al capturar orden de PayPal:', error);
        res.status(500).json({ error: 'Error al capturar la orden' });
    }
});

// Generar factura en PDF
router.post('/generate-invoice', (req, res) => {
    try {
        const { cart, total, date } = req.body;

        if (!cart || !total || !date) {
            return res.status(400).json({ error: 'Faltan datos para generar la factura' });
        }

        // Validar tamaño del payload
        const payloadSize = JSON.stringify(req.body).length;
        if (payloadSize > 10 * 1024 * 1024) { // 10MB
            return res.status(413).json({ error: 'Payload too large' });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'POST');

        doc.pipe(res);

        // Encabezado
        doc.fontSize(20).text('Factura de Compra', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha: ${new Date(date).toLocaleDateString('es-MX')}`, { align: 'right' });
        doc.moveDown();

        // Info de la farmacia
        doc.fontSize(14).text('Farmacia Digital', { align: 'left' });
        doc.fontSize(10).text('Dirección: Av. Siempre Viva 123, Ciudad, México', { align: 'left' });
        doc.fontSize(10).text('RFC: ABC123456XYZ', { align: 'left' });
        doc.moveDown(2);

        // Tabla de productos
        doc.fontSize(12).text('Detalles de la Compra:', { underline: true });
        doc.moveDown();

        // Encabezados de la tabla
        const tableTop = doc.y;
        const itemX = 50;
        const categoryX = 150;
        const quantityX = 250;
        const priceX = 350;
        const subtotalX = 450;

        doc.fontSize(10)
            .text('Producto', itemX, tableTop)
            .text('Categoría', categoryX, tableTop)
            .text('Cantidad', quantityX, tableTop)
            .text('Precio Unitario', priceX, tableTop)
            .text('Subtotal', subtotalX, tableTop);

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        let position = tableTop + 30;

        // Detalles de los productos
        cart.forEach((item) => {
            // Nombre del producto
            doc.fontSize(10).text(item.nombre, itemX, position, { width: 90, ellipsis: true });
            
            // Categoría
            doc.text(item.categoria, categoryX, position, { width: 90, ellipsis: true });
            
            // Cantidad
            doc.text(item.quantity.toString(), quantityX, position);
            
            // Precio unitario
            doc.text(`$${Number(item.precio).toFixed(2)} MXN`, priceX, position);
            
            // Subtotal
            doc.text(`$${(item.precio * item.quantity).toFixed(2)} MXN`, subtotalX, position);

            // Detalles adicionales en una línea nueva
            position += 15;
            doc.fontSize(8)
                .text(`Requiere receta: ${item.requiere_receta === 1 ? 'Sí' : 'No'} | Antibiótico: ${item.es_antibiotioco === 1 ? 'Sí' : 'No'}`,
                    itemX, position, { width: 400 });

            position += 20; // Espacio extra después de cada item
        });

        // Total
        doc.moveDown(2);
        doc.fontSize(12).text(`Total: $${total.toFixed(2)} MXN`, { align: 'right' });

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).text('Gracias por su compra!', { align: 'center' });
        doc.text('contacto@farmaciadigital.com', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ error: 'Error al generar la factura' });
    }
});

export default router;