const { builder } = require("@netlify/functions");
const FindGenerator = require("../../find-generator.js");

async function handler(event, context) {
  // e.g. /https%3A%2F%2Fwww.11ty.dev%2F/
  let [url] = event.path.split("/").filter(entry => !!entry);

  url = decodeURIComponent(url);

  try {
    // output to Function logs
    console.log("Fetching", url);

    let gen = new FindGenerator(url);
    await gen.fetch();

    let generator = gen.findMetaGenerator();

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ generator }, null, 2)
    };
  } catch (error) {
    console.log("Error", error);

    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}

exports.handler = builder(handler);
