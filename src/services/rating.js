const { sequalize } = require("../configs/mysqldb");
const Rating = require("../models/rating");
const Movie = require("../models/movie");

const getRatingsForMovieService = (movieId) => {
  return Rating.findAll({
    where: { movieId },
  });
};

const addRatingForMovieService = async (movieId, userId, rating) => {
  const ratingObj = await Rating.create({
    movieId,
    userId,
    rating,
  });

  const movie = await Movie.findOne({ id: movieId });

  return sequalize
    .sync({ alter: true })
    .then(() => {
      return ratingObj.setMovie(movie);
    })
    .then(() => {
      return ratingObj;
    });
};

module.exports = { getRatingsForMovieService, addRatingForMovieService };
