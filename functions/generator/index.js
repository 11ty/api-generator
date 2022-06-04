const { builder } = require("@netlify/functions");

const FindGenerator = require("../../find-generator.js");

const IMAGE_WIDTH = 60;
const IMAGE_HEIGHT = 60;

async function handler(event, context) {
  // e.g. /json/https%3A%2F%2Fwww.11ty.dev%2F/
  let [format, url] = event.path.split("/").filter(entry => !!entry);

  url = decodeURIComponent(url);

  try {
    // output to Function logs
    console.log("Fetching", url);

    let gen = new FindGenerator(url);
    await gen.fetch();

    let generator = gen.findData();

    if(format === "image") {
      let image = await gen.getImage(generator, IMAGE_WIDTH);

      return {
        statusCode: 200,
        headers: {
          "content-type": image.contentType,
          "x-generator-name": generator.name,
          "x-generator-version": generator.version,
        },
        body: image.body,
        isBase64Encoded: true
      };
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ generator }, null, 2)
    };
  } catch (error) {
    console.log("Error", error);

    if(format === "image") {
      return {
        // We need to return 200 here or Firefox won’t display the image
        // HOWEVER a 200 means that if it times out on the first attempt it will stay the default image until the next build.
        statusCode: 200,
        headers: {
          "content-type": "image/svg+xml",
          "x-error-message": error.message
        },
        // empty svg
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}"/>`,
        isBase64Encoded: false,
      };
    }

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
