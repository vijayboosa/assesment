// controllers/jobController.js
import db from '../models/index.js';
import { emitToRole } from '../services/notification.js';
const { Job, Application, Interview, User } = db;

/**
 * POST /jobs
 * Employers post a new job.
 */
export const postJob = async (req, res) => {
  try {
    if (req.userRole !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs.' });
    }
    
    const { title, description, location, salary } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      employerId: req.userId,
    });
    
    const io = req.app.get('io');
    emitToRole(
      io,
      'jobSeeker',
      'job:posted',
      `New Job Alert: ${job.title} in ${job.location}!`
    );
    
    res.status(201).json({ message: 'Job posted successfully.', job });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Server error while posting job.' });
  }
};

/**
 * GET /jobs
 * List all jobs (for job seekers to browse).
 */
export const listJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: {
        model: User,
        as: 'employer',
        attributes: ['username', 'fullName'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs.' });
  }
};

/**
 * GET /jobs/:jobId
 * Get details of a specific job.
 */
export const jobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findByPk(jobId, {
      include: {
        model: User,
        as: 'employer',
        attributes: ['username', 'fullName'],
      },
    });
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    let alreadyApplied = false;
    if (req.userRole === 'jobseeker') {
      const application = await Application.findOne({
        where: {
          jobId: job.id,
          jobSeekerId: req.userId,
        },
      });
      if (application) {
        alreadyApplied = true;
      }
    }
    
    res.status(200).json({ job, alreadyApplied });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ message: 'Server error while fetching job details.' });
  }
};

/**
 * POST /jobs/:jobId/apply
 * Job seekers apply for a job.
 */
export const applyJob = async (req, res) => {
  try {
    if (req.userRole !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can apply for jobs.' });
    }

    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const job = await Job.findByPk(jobId, {attributes: [ 'title','employerId']});
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    const application = await Application.create({
      jobId,
      jobSeekerId: req.userId,
      coverLetter,
    });
    
    const applicant = await User.findByPk(req.userId)
    if (!applicant) {
      return res.status(404).json({ message: 'user not found' });
    }
    console.log(`employee:${job.employerId}`);
    
    const io = req.app.get('io');
    emitToRole(
      io,
      `employee:${job.employerId}`,
      'application:received',
      `New Application alert: ${applicant.username} applied to ${job.title}`
    );

    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Server error while applying for job.' });
  }
};

/**
 * GET /employer/jobs
 * Get all jobs posted by the logged-in employer.
 */
export const getEmployerJobs = async (req, res) => {
  try {
    if (req.userRole !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view their posted jobs.' });
    }
    const jobs = await Job.findAll({
      where: { employerId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({ message: 'Server error while fetching your jobs.' });
  }
};

/**
 * GET /employer/jobs/:jobId/applications
 * Get all applications for a specific job posted by the employer.
 */
export const getJobApplications = async (req, res) => {
  try {
    if (req.userRole !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view applications for their jobs.' });
    }
    
    const { jobId } = req.params;
    const job = await Job.findByPk(jobId,{attributes: ['title', "employerId"]});
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    // Verify that the job belongs to the logged-in employer.
    if (job.employerId !== req.userId) {
      console.log(job.employerId, req.userId);
      
      return res.status(403).json({ message: 'Unauthorized. You do not own this job.' });
    }
    const applications = await Application.findAll({
      where: { jobId },
      include: {
        model: User,
        as: 'jobSeeker',
        attributes: ['id', 'username', 'fullName', 'email'],
      },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};
