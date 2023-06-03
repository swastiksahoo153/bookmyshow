const {
  getShowsService,
  addShowService,
  getShowsForMovieIdandDateService,
} = require("../services/show");

const getShows = async (request, response) => {
  getShowsService()
    .then((shows) => {
      response.status(200).json(shows);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

const addShow = async (request, response) => {
  const { startTime, endTime, date, theatreId, screenId, movieId } =
    request.body;

  addShowService(startTime, endTime, date, theatreId, screenId, movieId)
    .then((show) => {
      return response.json(show);
    })
    .catch((err) => {
      response.json(err);
    });
};

const getShowsForMovieIdandDate = async (request, response) => {
  let { theatreId, date } = request.params;
  theatreId = Number(theatreId);

  getShowsForMovieIdandDateService(theatreId, date)
    .then((shows) => {
      return response.status(200).json(shows);
    })
    .catch((error) => {
      return response.status(500).json(error);
    });
};

module.exports = {
  getShows,
  addShow,
  getShowsForMovieIdandDate,
};
