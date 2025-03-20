// models/user.js
import { ulid } from 'ulid';
import bcrypt from 'bcryptjs';

// ULIDs are generated in a time-sortable manner which means that new entries are roughly in order
// adding ulid's just to the users table just to show that we can have unique primary keys other than plain integer id's
// there are downsides to ulid's when the application is scaled.
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING(26),
      defaultValue: () => ulid(),
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('employer', 'jobseeker'),
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  // Instance method to compare password
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
