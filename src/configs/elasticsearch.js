const { Client } = require("@elastic/elasticsearch");

const CLOUD_ID =
  "c7e5550c714c4821a7e4b4ce26a3356c:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRhYjRhZDY0YWU4ZTI0ZGI4OTRkOGNjZWViODZjYWU4MCQxMTlhNzE2NDY4ZWQ0YmY2YTkzNjkyNDc4MGU4YmE3Ng==";
const USER_NAME = "elastic";
const PASSWORD = "VecsuD92TxfpVJfdHN9Atynh";

const elasticClient = new Client({
  cloud: {
    id: CLOUD_ID,
  },
  auth: {
    username: USER_NAME,
    password: PASSWORD,
  },
});

async function run() {
  const response = await elasticClient.index({
    index: "test-demo",
    id: "1",
    refresh: true,
    body: { foo: "bar" },
  });

  const response2 = await elasticClient.get({
    index: "test-demo",
    id: "1",
  });
}

run().catch((err) => {
  console.log(err);
  process.exit(1);
});

module.exports = { elasticClient };
