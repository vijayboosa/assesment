// routes/employerRoutes.js
import { Router } from 'express';
import verifyJWT from '../middlewares/authMiddleware.js';
import { getEmployerJobs, getJobApplications } from '../controllers/jobController.js';

const router = Router();

// Get all jobs posted by the logged-in employer.
router.get('/jobs', verifyJWT, getEmployerJobs);

// Get all applications for a specific job posted by the employer.
router.get('/jobs/:jobId/applications', verifyJWT, getJobApplications);

export default router;
