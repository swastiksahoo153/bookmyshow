const {
  getCommentsForMovieService,
  addCommentForMovieService,
} = require("../services/comment");

const getCommentsForMovie = async (request, response) => {
  let { movieId } = request.params;

  getCommentsForMovieService(movieId)
    .then((comments) => {
      return response.status(200).json(comments);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

const addCommentForMovie = async (request, response) => {
  let { movieId } = request.params;
  let { userId, comment, parentCommentId } = request.body;
  addCommentForMovieService(movieId, userId, comment, parentCommentId)
    .then((comment) => {
      response.status(200).json(comment);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

module.exports = { getCommentsForMovie, addCommentForMovie };
