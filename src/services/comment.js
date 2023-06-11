const { sequalize } = require("../configs/mysqldb");
const Comment = require("../models/comment");
const Movie = require("../models/movie");

const getCommentsForMovieService = (movieId) => {
  return Comment.findAll({
    where: { movieId },
  });
};

const addCommentForMovieService = async (
  movieId,
  userId,
  comment,
  parentCommentId
) => {
  const commentObj = await Comment.create({
    movieId,
    userId,
    comment,
    parentCommentId,
  });

  const movie = await Movie.findOne({ id: movieId });

  return sequalize
    .sync({ alter: true })
    .then(() => {
      return commentObj.setMovie(movie);
    })
    .then(() => {
      return commentObj;
    });
};

module.exports = { getCommentsForMovieService, addCommentForMovieService };
