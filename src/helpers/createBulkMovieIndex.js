const ESClient = require("../configs/elasticsearch").elasticClient;

/**
 * Deletes previous index and creates new index
 * @param {string} indexName
 * @param {Object} schema
 */
async function createIndex(indexName, schema) {
  try {
    if (await ESClient.indices.exists({ index: indexName })) {
      console.log(
        ` Deleting index ${indexName} because it's already exists ...`
      );
      await ESClient.indices.delete({ index: indexName });
    }
    await ESClient.indices.create({
      index: indexName,
    });
    console.log(`Created Index ${indexName}`);

    await ESClient.indices.create({
      index: indexName,
      body: {
        mappings: schema,
      },
    });
  } catch (err) {
    console.log(`An error occurred while creating an index ${indexName}`);
    console.error(err);
  }
}

/**
 * Index the given data
 * @param {Array} dataset
 * @param {string} indexName
 * @returns {void}
 */
async function populateIndex(indexName, dataset) {
  const operations = dataset.flatMap((doc) => [
    { index: { _index: indexName } },
    doc,
  ]);
  const bulkResponse = await ESClient.bulk({ refresh: true, operations });
  console.log("bulk-response: ", bulkResponse);
  console.log(bulkResponse.items);
  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await ESClient.count({ index: indexName });
  console.log(count);
}

module.exports = { populateIndex, createIndex };
