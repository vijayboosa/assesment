// models/interview.js
export default (sequelize, DataTypes) => {
    const Interview = sequelize.define('Interview', {
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      // applicationId will be defined via association with Application
    });
  
    return Interview;
  };
  