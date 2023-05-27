// Import the sequelize connection from config file
// Import datatypes from the sequelize library

const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");

const Show = require("./show");

// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Booking = sequalize.define("booking", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  seatNum: {
    type: DataTypes.INTEGER,
  },
});

/**
 * Define relationship between the models
 */

// One to Many
Show.hasMany(Booking, {
  onDelete: "CASCADE",
});
Booking.belongsTo(Show);

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Booking;
