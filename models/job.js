// models/job.js
export default (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
      },
      salary: {
        type: DataTypes.DECIMAL,
      },
      // employerId will be the foreign key defined in the association
    });
  
    return Job;
  };
  