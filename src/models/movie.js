const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");

// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Movie = sequalize.define("movie", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING(100),
  },
  description: {
    type: DataTypes.STRING(1000),
  },
});

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Movie;
