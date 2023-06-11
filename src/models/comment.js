const sequalize = require("../configs/mysqldb").sequalize;
const DataTypes = require("sequelize");

const Movie = require("./movie");

// Define the model by providing name of the table, it's columns, their datatypes and constraints.

const Comment = sequalize.define("comment", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  parentCommentId: {
    type: DataTypes.INTEGER,
  },
});

/**
 * Define relationship between the models
 */

Movie.hasMany(Comment, {
  onDelete: "CASCADE",
});
Comment.belongsTo(Movie);

// Execute the sync command to run migrations
sequalize.sync();

module.exports = Comment;
