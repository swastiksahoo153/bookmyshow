const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");

const Movie = require("./movie");

// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Rating = sequalize.define("rating", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

/**
 * Define relationship between the models
 */

Movie.hasMany(Rating, {
  onDelete: "CASCADE",
});
Rating.belongsTo(Movie);

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Rating;
