const { getNext7Dates } = require("../helpers/dateHelper");

const { getTheatreService, addTheatreService } = require("../services/theatre");

/**
 * GET /theatre controller
 */
const getTheatre = async (request, response) => {
  getTheatreService()
    .then((theatre) => {
      response.status(200).json(theatre);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

/**
 * POST /theatre
 */
const addTheatre = (request, response) => {
  const { name, address } = request.body;

  addTheatreService(name, address)
    .then(function (success) {
      response.status(201).json(success);
    })
    .catch(function (error) {
      response.status(500).json(error);
    });
};

const getDatesForTheatre = async (request, response) => {
  const next7Dates = getNext7Dates();

  return response.status(200).json({
    next7Dates: next7Dates,
  });
};

module.exports = {
  getTheatre,
  addTheatre,
  getDatesForTheatre,
};
