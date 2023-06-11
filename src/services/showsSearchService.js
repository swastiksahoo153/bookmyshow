const { elasticClient } = require("../configs/elasticsearch");
const indexName = "shows";

const searchShowsFromElastic = async (language, dimension, genre, query) => {
  const shouldConditions = [];
  if (language) {
    shouldConditions.push({ term: { "language.keyword": language } });
  }
  if (dimension) {
    shouldConditions.push({ term: { "screen.video.keyword": dimension } });
  }

  if (genre) {
    shouldConditions.push({
      wildcard: {
        "genre.keyword": `*${genre}*`,
      },
    });
  }
  console.log("shouldconditions: ", shouldConditions);
  const requestBody = {
    query: {
      bool: {
        filter: [
          {
            bool: {
              should: shouldConditions,
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
    console.log("result: ", result);
    return result;
  } catch (error) {
    console.error("Error getting index:", error);
    return error;
  }
};

module.exports = { searchShowsFromElastic };
