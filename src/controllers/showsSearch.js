const { searchShowsFromElastic } = require("../services/showsSearchService");

const searchShows = async (request, response) => {
  const { dimension, language, genre, query = "" } = request.body;
  searchShowsFromElastic(dimension, language, genre, query)
    .then((shows) => {
      response.status(200).json(shows);
    })
    .catch((error) => {
      response.status(500).json(error);
    });
};

module.exports = {
  searchShows,
};
