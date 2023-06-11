const express = require("express");
const router = express.Router();
const Redis = require("redis");

const {
  getTheatre,
  addTheatre,
  getDatesForTheatre,
} = require("../controllers/theatre");
const { getMovies, addMovie } = require("../controllers/movie");
const { getScreens, addScreen } = require("../controllers/screen");
const {
  getShows,
  addShow,
  getShowsForMovieIdandDate,
} = require("../controllers/show");
const {
  getBookingsForShow,
  bookSeatsForShow,
} = require("../controllers/booking");

const {
  addRatingForMovie,
  getRatingsForMovie,
} = require("../controllers/rating");
const {
  addCommentForMovie,
  getCommentsForMovie,
} = require("../controllers/comment");
const { searchShows } = require("../controllers/showsSearch");

const { elasticClient } = require("../configs/elasticsearch");

const indexName = "shows";

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

/**
 * GET rating for movie
 */
router.post("/movie/rating/:movieId", addRatingForMovie);

/**
 * POST rating for movie
 */
router.get("/movie/rating/:movieId", getRatingsForMovie);

/**
 * GET comment for movie
 */
router.post("/movie/comment/:movieId", addCommentForMovie);

/**
 * POST comment for movie
 */
router.get("/movie/comment/:movieId", getCommentsForMovie);

router.get("/index/movies/", async (request, response) => {
  try {
    const indexInfo = await elasticClient.indices.get({
      index: indexName,
    });

    console.log(indexInfo);
    response.status(200).json(indexInfo);
  } catch (error) {
    console.error("Error getting index:", error);
    response.status(400).json(error);
  }
});

router.get("/index/movies/search", async (request, response) => {
  try {
    const result = await elasticClient.search({
      index: indexName,
      body: {
        query: {
          match_all: {}, // Match all documents
        },
      },
    });
    response.status(200).json(result);
  } catch (error) {
    console.error("Error getting index:", error);
    response.status(400).json(error);
  }
});

router.get("/movies/search", searchShows);

module.exports = router;
