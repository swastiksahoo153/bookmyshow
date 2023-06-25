const sequalize = require("../configs/mysqldb").sequalize;
const Theatre = require("../models/theatre");
const Movie = require("../models/movie");
const Screen = require("../models/screen");
const Show = require("../models/show");
const { elasticSearch } = require("../configs/elasticsearch");
const Address = require("../models/address");

const getShowsService = () => {
  return Show.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "movieId", "screenId", "theatreId"],
    },
    include: [
      {
        model: Theatre,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Address,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      },
      {
        model: Screen,
        attributes: {
          exclude: ["createdAt", "updatedAt", "theatreId"],
        },
      },
      {
        model: Movie,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
  movieId,
  language
) => {
  const show = await Show.create({
    startTime,
    endTime,
    showDate: date,
    theatreId,
    screenId,
    movieId,
    language,
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
