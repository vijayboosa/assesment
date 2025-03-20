// routes/applicationRoutes.js
import { Router } from 'express';
import { rejectApplication, scheduleInterview, getMyApplications } from '../controllers/applicationController.js';
import verifyJWT from '../middlewares/authMiddleware.js';

const router = Router();

// Reject an application.
router.post('/:applicationId/reject', verifyJWT, rejectApplication);

// Schedule an interview.
router.post('/:applicationId/schedule', verifyJWT, scheduleInterview);

// Allow job seekers to fetch their own application statuses.
router.get('/applied', verifyJWT, getMyApplications);

export default router;
