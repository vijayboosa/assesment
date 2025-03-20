// models/application.js
export default (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
      coverLetter: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM('pending', 'rejected', 'interview_scheduled'),
        defaultValue: 'pending',
      },
      // jobId and jobSeekerId will be set up via associations
    });
  
    return Application;
  };
  