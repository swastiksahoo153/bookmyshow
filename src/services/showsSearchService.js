const { elasticClient } = require("../configs/elasticsearch");
const indexName = "shows";

const searchShowsFromElastic = async (dimension, language, genre, query) => {
  const mustConditions = [];
  if (language) {
    mustConditions.push({ term: { "language.keyword": language } });
  }
  if (dimension) {
    mustConditions.push({ term: { "screen.video.keyword": dimension } });
  }

  if (genre) {
    mustConditions.push({
      wildcard: {
        "movie.genre.keyword": `*${genre}*`,
      },
    });
  }
  console.log("mustConditions: ", mustConditions);
  const requestBody = {
    query: {
      bool: {
        filter: [
          {
            bool: {
              must: mustConditions,
              minimum_should_match: 0,
            },
          },
        ],
        should: [
          {
            multi_match: {
              query,
              fields: ["movie.name", "theatre.name"],
              fuzziness: "AUTO",
            },
          },
        ],
        minimum_should_match: 0,
      },
    },
  };
  console.log(JSON.stringify(requestBody));

  try {
    const result = await elasticClient.search({
      index: indexName,
      body: requestBody,
    });
    return result;
  } catch (error) {
    console.error("Error getting index:", error);
    return error;
  }
};

module.exports = { searchShowsFromElastic };
