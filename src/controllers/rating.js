const {
  getRatingsForMovieService,
  addRatingForMovieService,
} = require("../services/rating");

const getRatingsForMovie = async (request, response) => {
  let { movieId } = request.params;

  getRatingsForMovieService(movieId)
    .then((ratings) => {
      return response.status(200).json(ratings);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

const addRatingForMovie = async (request, response) => {
  let { movieId } = request.params;
  let { userId, rating } = request.body;
  addRatingForMovieService(movieId, userId, rating)
    .then((ratingObj) => {
      response.status(200).json(ratingObj);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

module.exports = { getRatingsForMovie, addRatingForMovie };
