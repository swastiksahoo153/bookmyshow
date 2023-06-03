const sequalize = require("../configs/mysqldb").sequalize;
const Theatre = require("../models/theatre");
const Movie = require("../models/movie");
const Screen = require("../models/screen");
const Show = require("../models/show");

const getShowsService = () => {
  return Show.findAll({
    include: [
      {
        model: Theatre,
      },
      {
        model: Screen,
      },
      {
        model: Movie,
      },
    ],
  });
};

const addShowService = async (
  startTime,
  endTime,
  date,
  theatreId,
  screenId,
  movieId
) => {
  const show = await Show.create({
    startTime,
    endTime,
    showDate: date,
    theatreId,
    screenId,
    movieId,
  });

  return sequalize
    .sync({ alter: true })
    .then(() => {
      return Theatre.findOne({
        where: { id: theatreId },
      });
    })
    .then((theatre) => {
      return show.setTheatre(theatre);
    })
    .then(() => {
      return Screen.findOne({
        where: { id: screenId },
      });
    })
    .then((screen) => {
      return show.setScreen(screen);
    })
    .then(() => {
      return Movie.findOne({
        where: { id: movieId },
      });
    })
    .then((movie) => {
      show.setMovie(movie);
    })
    .then(() => show);
};

const getShowsForMovieIdandDateService = async (theatreId, date) => {
  theatreId = Number(theatreId);

  return Show.findAll({
    where: { theatreId: theatreId, showDate: date },
    include: [
      {
        model: Theatre,
      },
      {
        model: Screen,
      },
      {
        model: Movie,
      },
    ],
  });
};

module.exports = {
  getShowsService,
  addShowService,
  getShowsForMovieIdandDateService,
};
