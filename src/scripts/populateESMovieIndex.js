const { getShowsService } = require("../services/show");
const {
  createIndex,
  populateIndex,
} = require("../helpers/createBulkMovieIndex");

const indexName = "shows";

const showIndexMappings = {
  dynamic: "strict",
  properties: {
    id: { type: "integer" },
    startTime: { type: "text" },
    endTime: { type: "text" },
    showDate: { type: "text" },
    language: { type: "text" },
    theatre: {
      id: { type: "integer" },
      name: { type: "text" },
      address: {
        id: { type: "integer" },
        city: { type: "text" },
        state: { type: "text" },
        country: { type: "text" },
        pincode: { type: "integer" },
      },
    },
    screen: {
      id: { type: "integer" },
      number: { type: "integer" },
      audio: { type: "text" },
      video: { type: "text" },
      totalSeats: { type: "integer" },
    },
    movie: {
      id: { type: "integer" },
      name: { type: "text" },
      genre: { type: "text" },
      description: { type: "text" },
    },
  },
};

const populateMovieIndex = async () => {
  const shows = await getShowsService();

  await createIndex(indexName, showIndexMappings);
  await populateIndex(indexName, shows);
};

populateMovieIndex();
