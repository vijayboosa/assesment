// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import employerRoutes from './routes/employerRoutes.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Use cookie parser so csurf can read the token from cookies.
app.use(cookieParser());

// Routes
app.use('/api', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/application', applicationRoutes);


// Global error handler (can be expanded for production)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
