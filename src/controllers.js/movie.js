const { getMoviesService, addMovieService } = require("../services/movie");

const getMovies = async (request, response) => {
  getMoviesService()
    .then((movies) => {
      response.status(200).json(movies);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

const addMovie = async (request, response) => {
  const { name, genre, description } = request.body;

  addMovieService(name, genre, description)
    .then((movie) => {
      response.status(200).json(movie);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

module.exports = { getMovies, addMovie };
