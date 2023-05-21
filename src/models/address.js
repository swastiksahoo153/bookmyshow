const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");

// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Address = sequalize.define("address", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Address;
