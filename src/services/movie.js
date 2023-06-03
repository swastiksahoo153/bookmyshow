const Movie = require("../models/movie");

const getMoviesService = () => {
  return Movie.findAll();
};

const addMovieService = (name, genre, description) => {
  return Movie.create({
    name,
    genre,
    description,
  });
};

module.exports = { getMoviesService, addMovieService };
