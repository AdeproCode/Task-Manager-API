const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  due_date: { type: DataTypes.DATE },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' }
},
  {
    timestamps: true
  }
);

Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = Task;
