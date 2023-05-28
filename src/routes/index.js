const express = require("express");
const router = express.Router();
const sequalize = require("../configs/mysqldb").sequalize;
const Theatre = require("../models/theatre");
const Address = require("../models/address");
const Movie = require("../models/movie");
const Screen = require("../models/screen");
const Show = require("../models/show");
const Booking = require("../models/bookings");
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
  const { number, audio, video, theatreId, totalSeats } = request.body;

  const screen = await Screen.create({
    number,
    audio,
    video,
    theatreId,
    totalSeats,
  });

  sequalize
    .sync({ alter: true })
    .then(() => {
      return Theatre.findOne({ where: { id: theatreId } });
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
 * POST /show
 */
router.post("/show", async (request, response) => {
  const { startTime, endTime, date, theatreId, screenId, movieId } =
    request.body;

  const show = await Show.create({
    startTime,
    endTime,
    date,
    theatreId,
    screenId,
    movieId,
  });

  sequalize
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
router.get("/dates/:theatreId", async (request, response) => {
  const theatreId = request.params.theatreId;
  const next7Dates = getNext7Dates();
  const theatre = await Theatre.findOne({ where: { id: theatreId } });

  return response.status(200).json({
    next7Dates: next7Dates,
    theatreId: theatre.id,
  });
});

/**
 * GET movies with show times for the given date and theatre
 */
router.get("/shows/:theatreId/:date", async (request, response) => {
  let { theatreId, date } = request.params;
  theatreId = Number(theatreId);

  const shows = await Show.findAll({
    where: { theatreId: theatreId, date: date },
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
});

/**
 * GET bookings for the specified show
 */
router.get("/show/:showId/bookings", async (request, response) => {
  let { showId } = request.params;
  showId = Number(showId);

  const bookings = await Booking.findAll({
    where: { showId },
  });

  return response.status(200).json(bookings);
});

/**
 * POST book seats
 */
router.post("/show/book", async (request, response) => {
  let { showId, userId, seatNums } = request.body;
  const { screenId } = await Show.findOne({ where: { id: showId } });
  const { totalSeats } = await Screen.findOne({ where: { id: screenId } });

  try {
    await sequalize.transaction(async (transaction) => {
      const bookings = await Booking.findAll(
        {
          where: { showId },
        },
        { transaction }
      );

      const bookedSeats = bookings.map((booking) => booking.seatNum);

      const commonSeats = bookedSeats.filter((value) =>
        seatNums.includes(value)
      );

      if (commonSeats.length > 0) {
        throw `${commonSeats} are already booked`;
      }

      const seatsExceedingMaxSeatNums = seatNums.filter(
        (value) => Number(value) > totalSeats
      );

      const nonPositiveSeats = seatNums.filter((value) => Number(value) < 1);

      const seatsNotPresent =
        seatsExceedingMaxSeatNums.concat(nonPositiveSeats);

      if (seatsNotPresent.length > 0) {
        throw `${seatsNotPresent} are not present`;
      }

      const newBookings = await Booking.bulkCreate(
        seatNums.map(
          (seatNum) => {
            return {
              seatNum,
              userId,
              showId,
            };
          },
          { transaction }
        )
      );

      return response.status(200).json(newBookings);
    });
  } catch (err) {
    return response.status(400).json(err);
  }
});

module.exports = router;
