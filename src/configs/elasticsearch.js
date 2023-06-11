const { Client } = require("@elastic/elasticsearch");

const { ELASTIC_CLOUD_ID, ELASTIC_PASSWORD, ELASTIC_USER_NAME } = process.env;

const elasticClient = new Client({
  cloud: {
    id: ELASTIC_CLOUD_ID,
  },
  auth: {
    username: ELASTIC_USER_NAME,
    password: ELASTIC_PASSWORD,
  },
});

module.exports = { elasticClient };
