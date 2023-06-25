const {
  getBookingsForShowService,
  bookSeatsForShowService,
} = require("../services/booking");

const getBookingsForShow = async (request, response) => {
  let { showId } = request.params;

  getBookingsForShowService(showId)
    .then((bookings) => {
      return response.status(200).json(bookings);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

const bookSeatsForShow = async (request, response) => {
  let { showId, userId, seatNums } = request.body;
  bookSeatsForShowService(showId, userId, seatNums)
    .then((booking) => {
      response.status(200).json(booking);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

module.exports = { getBookingsForShow, bookSeatsForShow };
