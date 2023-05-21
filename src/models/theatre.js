// Import the sequelize connection from config file
// Import datatypes from the sequelize library

const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");
const Address = require("./address");

// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Theatre = sequalize.define("theatre", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
});

Address.hasOne(Theatre); // OnDelete - Null (default)
Theatre.belongsTo(Address);

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Theatre;
