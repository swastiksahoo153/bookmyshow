const Theatre = require("../models/theatre");
const Address = require("../models/address");

/**
 * Find theatre service
 */

const getTheatreService = () => {
  return Theatre.findAll({
    include: [
      {
        model: Address,
      },
    ],
  });
};

/**
 * Add theatre service
 */
const addTheatreService = async (name, address) => {
  const tAddress = await Address.create({
    ...address,
  });

  const theatre = await Theatre.create({
    name: name,
  });

  return theatre.setAddress(tAddress);
};

module.exports = {
  getTheatreService,
  addTheatreService,
};
