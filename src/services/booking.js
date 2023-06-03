const sequalize = require("../configs/mysqldb").sequalize;
const Booking = require("../models/bookings");
const Show = require("../models/show");
const Screen = require("../models/screen");

const getBookingsForShowService = (showId) => {
  showId = Number(showId);

  return Booking.findAll({
    where: { showId },
  });
};

const bookSeatsForShowService = async (showId, userId, seatNums) => {
  const { screenId } = await Show.findOne({ where: { id: showId } });
  const { totalSeats } = await Screen.findOne({ where: { id: screenId } });

  return sequalize.transaction(async (transaction) => {
    const bookings = await Booking.findAll(
      {
        where: { showId },
      },
      { transaction }
    );

    const bookedSeats = bookings.map((booking) => booking.seatNum);

    const commonSeats = bookedSeats.filter((value) => seatNums.includes(value));

    if (commonSeats.length > 0) {
      throw `${commonSeats} are already booked`;
    }

    const seatsExceedingMaxSeatNums = seatNums.filter(
      (value) => Number(value) > totalSeats
    );

    const nonPositiveSeats = seatNums.filter((value) => Number(value) < 1);

    const seatsNotPresent = seatsExceedingMaxSeatNums.concat(nonPositiveSeats);

    if (seatsNotPresent.length > 0) {
      throw `${seatsNotPresent} are not present`;
    }

    return Booking.bulkCreate(
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
  });
};

module.exports = { getBookingsForShowService, bookSeatsForShowService };
