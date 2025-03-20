// routes/jobRoutes.js
import { Router } from 'express';
import { postJob, listJobs, jobDetails, applyJob } from '../controllers/jobController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = Router();

// Route for employers to post a job (protected).
router.post('/job', verifyJWT, postJob);

// Route to list all jobs (open to everyone, though you might restrict it in your actual app).
router.get('/jobs', verifyJWT, listJobs);

// Route to get details about a specific job.
router.get('/job/:jobId',verifyJWT, jobDetails);

// Route for job seekers to apply for a job (protected).
router.post('/job/:jobId/apply', verifyJWT, applyJob);

export default router;
