const sequalize = require("../configs/mysqldb").sequalize;
const Screen = require("../models/screen");
const Theatre = require("../models/theatre");

const getScreensService = async () => {
  return Screen.findAll({
    include: [
      {
        model: Theatre,
      },
    ],
  });
};

const addScreenService = async (
  number,
  audio,
  video,
  theatreId,
  totalSeats
) => {
  const screen = await Screen.create({
    number,
    audio,
    video,
    theatreId,
    totalSeats,
  });

  return sequalize
    .sync({ alter: true })
    .then(() => {
      return Theatre.findOne({ where: { id: theatreId } });
    })
    .then((theatre) => {
      return screen.setTheatre(theatre);
    })
    .then(() => {
      return screen;
    });
};

module.exports = { getScreensService, addScreenService };
