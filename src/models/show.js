// Import the sequelize connection from config file
// Import datatypes from the sequelize library

const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");

const Movie = require("./movie");
const Screen = require("./screen");
const Theatre = require("./theatre");
// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Show = sequalize.define("show", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

Movie.hasMany(Show, {
  onDelete: "CASCADE",
});
Show.belongsTo(Movie);

Screen.hasMany(Show, {
  onDelete: "CASCADE",
});
Show.belongsTo(Screen);

Theatre.hasMany(Show, {
  onDelete: "CASCADE",
});
Show.belongsTo(Theatre);

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Show;
