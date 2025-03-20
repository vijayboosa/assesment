// controllers/applicationController.js
import db from '../models/index.js';
import { emitToRole } from '../services/notification.js';
const { Application, Interview, Job, User } = db;

/**
 * Reject an application.
 * Endpoint: POST /applications/:applicationId/reject
 */
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findByPk(applicationId, {
      include:[ { model: Job, as: 'job' },
      {
        model: User, 
        as: 'jobSeeker' 
      }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    if (application.job.employerId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized. You are not the owner of this job.' });
    }
    application.status = 'rejected';
    await application.save();

    // Access the job seeker's ID
    const applicantId = application.jobSeeker.id;
    
    const io = req.app.get('io');
    emitToRole(
      io,
      `user:${applicantId}`,
      'application:rejected',
      `Application rejected:  Your application for ${application.job.title} was rejected!`
    );
    return res.status(200).json({ message: 'Application rejected successfully.', application });
  } catch (error) {
    console.error('Error rejecting application:', error);
    return res.status(500).json({ message: 'Server error while rejecting application.' });
  }
};

/**
 * Schedule an interview for an application.
 * Endpoint: POST /applications/:applicationId/schedule
 */
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { scheduledAt, notes } = req.body;

    if (!scheduledAt) {
      return res.status(400).json({ message: 'Interview date/time is required.' });
    }

    const application = await Application.findByPk(applicationId, {
      include: [{ model: Job, as: 'job' },
        {
          model: User, 
          as: 'jobSeeker' 
        }]
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    if (application.job.employerId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized. You are not the owner of this job.' });
    }
    application.status = 'interview_scheduled';
    await application.save();
    
    const interview = await Interview.create({
      applicationId: application.id,
      scheduledAt,
      notes,
    });
    
    // Access the job seeker's ID
    const applicantId = application.jobSeeker.id;

    const io = req.app.get('io');
    emitToRole(
      io,
      `user:${applicantId}`,
      'interview:scheduled',
      `Interview Scheduled: Interview scheduled for ${application.job.title} on ${scheduledAt}!`
    );

    return res.status(200).json({ message: 'Interview scheduled successfully.', interview });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return res.status(500).json({ message: 'Server error while scheduling interview.' });
  }
};

/**
 * Get the logged-in job seeker's application statuses.
 * Endpoint: GET /applications/my
 */
export const getMyApplications = async (req, res) => {
  try {
    // Ensure only job seekers can view their applications.
    if (req.userRole !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can view their applications.' });
    }

    const applications = await Application.findAll({
      where: { jobSeekerId: req.userId },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'description', 'location', 'salary'],
        },
        {
          model: Interview,
          as: 'interview',
          attributes: ['scheduledAt', 'notes'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ message: 'Server error while fetching your applications.' });
  }
};
