import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

/**
 * CORS CONFIGURATION
 * - En producción (Render): permite el frontend desplegado
 * - En desarrollo: permite todo para evitar bloqueos
 */
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Parse JSON
app.use(express.json());

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend build (si aplica)
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api', routes);

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌐 CORS allowed origin: ${process.env.ALLOWED_ORIGIN || 'ALL (*)'}`);
});