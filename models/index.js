// models/index.js
import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import defineUser from './user.js';
import defineJob from './job.js';
import defineApplication from './application.js';
import defineInterview from './interview.js';


const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.db_port,
    dialect: 'mysql',
    logging: false, 
     timezone: '+00:00'
  }
);

try {
  await sequelize.authenticate();
  console.log('Database connected.');
} catch (err) {
  console.error('Database connection error:', err);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models
db.User = defineUser(sequelize, Sequelize);
db.Job = defineJob(sequelize, Sequelize);
db.Application = defineApplication(sequelize, Sequelize);
db.Interview = defineInterview(sequelize, Sequelize);

// Define Associations

// User (employer) has many jobs
db.User.hasMany(db.Job, { foreignKey: 'employerId', as: 'jobs' });
db.Job.belongsTo(db.User, { foreignKey: 'employerId', as: 'employer' });

// Job has many applications; an application belongs to a job.
db.Job.hasMany(db.Application, { foreignKey: 'jobId', as: 'applications' });
db.Application.belongsTo(db.Job, { foreignKey: 'jobId', as: 'job' });

// User (jobseeker) has many applications
db.User.hasMany(db.Application, { foreignKey: 'jobSeekerId', as: 'applications' });
db.Application.belongsTo(db.User, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });

// Application has one Interview (optional)
db.Application.hasOne(db.Interview, { foreignKey: 'applicationId', as: 'interview' });
db.Interview.belongsTo(db.Application, { foreignKey: 'applicationId', as: 'application' });

export default db;
