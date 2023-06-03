const { getScreensService, addScreenService } = require("../services/screen");

const getScreens = async (request, response) => {
  getScreensService()
    .then((screens) => {
      return response.status(200).json(screens);
    })
    .catch((error) => {
      return response.status(500).json(error);
    });
};

const addScreen = async (request, response) => {
  const { number, audio, video, theatreId, totalSeats } = request.body;

  addScreenService(number, audio, video, theatreId, totalSeats)
    .then((screen) => {
      return response.json(screen);
    })
    .catch((err) => {
      response.json(err);
    });
};

module.exports = { getScreens, addScreen };
