const express = require("express");
const router = express.Router();
const Redis = require("redis");

const {
  getTheatre,
  addTheatre,
  getDatesForTheatre,
} = require("../controllers.js/theatre");
const { getMovies, addMovie } = require("../controllers.js/movie");
const { getScreens, addScreen } = require("../controllers.js/screen");
const {
  getShows,
  addShow,
  getShowsForMovieIdandDate,
} = require("../controllers.js/show");
const {
  getBookingsForShow,
  bookSeatsForShow,
} = require("../controllers.js/booking");

const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 3600;

/**
 * GET /theatre
 */
router.get("/theatres", getTheatre);

/**
 * POST /theatre
 */
router.post("/theatre", addTheatre);

/**
 * GET /movies
 */
router.get("/movies", getMovies);

/**
 * POST /movies
 */
router.post("/movie", addMovie);

/**
 * GET /screens
 */
router.get("/screens", getScreens);

/**
 * POST /screens
 */
router.post("/screen", addScreen);

/**
 * GET /shows
 */
router.get("/shows", getShows);

/**
 * POST /show
 */
router.post("/show", addShow);

/**
 * GET next 7 dates for the movie
 */
router.get("/dates/:theatreId", getDatesForTheatre);

/**
 * GET movies with show times for the given date and theatre
 */
router.get("/shows/:theatreId/:date", getShowsForMovieIdandDate);

/**
 * GET bookings for the specified show
 */
router.get("/show/:showId/bookings", getBookingsForShow);

/**
 * POST book seats
 */
router.post("/show/book", bookSeatsForShow);

module.exports = router;
