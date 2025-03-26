import express from 'express';
import userRoutes from './userRoutes.js';
import apiRoutes from './apiRoutes.js';
import userValidationRoutes from './userValidationRoutes.js';
import loginRoutes from './loginRoutes.js';
import adminRoutes from './adminRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import homeRoutes from './homeRoutes.js';
import payPalRoutes from './payPalRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/validation', userValidationRoutes);
router.use('/2fa', apiRoutes);
router.use('/login', loginRoutes);
router.use('/admin', adminRoutes);
router.use('/doctor', doctorRoutes);
router.use('/home', homeRoutes);
router.use('/paypal', payPalRoutes);

export default router;
