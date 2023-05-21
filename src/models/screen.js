// Import the sequelize connection from config file
// Import datatypes from the sequelize library

const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");

const Theatre = require("./theatre");
// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Screen = sequalize.define("screen", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  audio: {
    type: DataTypes.STRING(200),
  },
  video: {
    type: DataTypes.STRING(200),
  },
});

Theatre.hasMany(Screen, {
  onDelete: "CASCADE",
});
Screen.belongsTo(Theatre);

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Screen;
