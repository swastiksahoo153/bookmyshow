const express = require("express");
const router = express.Router();
const sequalize = require("../configs/mysqldb").sequalize;
const Theatre = require("../models/theatre");
const Address = require("../models/address");
const Movie = require("../models/movie");
const Screen = require("../models/screen");
const Show = require("../models/show");
const { getNext7Dates } = require("../helpers/dateHelper");

/**
 * GET /theatre
 */
router.get("/theatres", async (request, response) => {
  const theatre = await Theatre.findAll({
    include: [
      {
        model: Address,
      },
    ],
  });
  response.status(200).json(theatre);
});

/**
 * POST /theatre
 */
router.post("/theatre", async (request, response) => {
  const { name, address } = request.body;

  const tAddress = await Address.create({
    ...address,
  });

  const theatre = await Theatre.create({
    name: name,
  });

  theatre
    .setAddress(tAddress)
    .then(function (success) {
      response.status(201).json(success);
    })
    .catch(function (error) {
      response.json(error);
    });
});

/**
 * GET /movies
 */
router.get("/movies", async (request, response) => {
  const movies = await Movie.findAll();
  response.status(200).json(movies);
});

/**
 * POST /movies
 */
router.post("/movie", async (request, response) => {
  const { name, genre, description } = request.body;

  const movie = await Movie.create({
    name,
    genre,
    description,
  });

  response.status(200).json(movie);
});

/**
 * GET /screens
 */
router.get("/screens", async (request, response) => {
  const screens = await Screen.findAll({
    include: [
      {
        model: Theatre,
      },
    ],
  });
  response.status(200).json(screens);
});

/**
 * POST /screens
 */
router.post("/screen", async (request, response) => {
  const { number, audio, video, theatreName } = request.body;

  const screen = await Screen.create({
    number,
    audio,
    video,
    theatreName,
  });

  sequalize
    .sync({ alter: true })
    .then(() => {
      return Theatre.findOne({ where: { name: theatreName } });
    })
    .then((theatre) => {
      return screen.setTheatre(theatre);
    })
    .then(() => {
      return response.json(screen);
    })
    .catch((err) => {
      response.json(err);
    });
});

/**
 * GET /shows
 */
router.get("/shows", async (request, response) => {
  const shows = await Show.findAll({
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
  response.status(200).json(shows);
});

/**
 * POST /shows
 */
router.post("/show", async (request, response) => {
  const { startTime, endTime, date, theatreName, screenNumber, movieName } =
    request.body;

  const show = await Show.create({
    startTime,
    endTime,
    date,
    theatreName,
    screenNumber,
    movieName,
  });

  sequalize
    .sync({ alter: true })
    .then(() => {
      return Theatre.findOne({
        where: { name: theatreName },
      });
    })
    .then((theatre) => {
      return show.setTheatre(theatre);
    })
    .then(() => {
      return Screen.findOne({
        where: { number: screenNumber },
      });
    })
    .then((screen) => {
      return show.setScreen(screen);
    })
    .then(() => {
      return Movie.findOne({
        where: { name: movieName },
      });
    })
    .then((movie) => {
      return show.setMovie(movie);
    })
    .then(() => {
      return response.json(show);
    })
    .catch((err) => {
      response.json(err);
    });
});

/**
 * GET next 7 dates for the movie
 */
router.get("/movie-dates/:theatreName", async (request, response) => {
  const theatreName = request.params.theatreName;
  const next7Dates = getNext7Dates();
  const theatre = await Theatre.findOne({ where: { name: theatreName } });

  return response.status(200).json({
    next7Dates: next7Dates,
    theatreId: theatre.id,
  });
});

/**
 * GET movies with show times for the given date and theatre
 */
router.get(
  "/movies-for-theatre-date/:theatreId/:date",
  async (request, response) => {
    let { theatreId, date } = request.params;
    theatreId = Number(theatreId);

    const shows = await Show.findAll({
      where: { theatreId: theatreId, date: "2023-05-21" },
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

    return response.status(200).json(shows);
  }
);

module.exports = router;
