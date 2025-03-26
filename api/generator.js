import FindGenerator from "../find-generator.js";

const ONE_DAY = 60*60*24;
const ONE_WEEK = ONE_DAY*7;

const IMAGE_WIDTH = 60;
const IMAGE_HEIGHT = 60;

function isFullUrl(url) {
  try {
    new URL(url);
    return true;
  } catch(e) {
    // invalid url OR local path
    return false;
  }
}

function getEmptyImageResponse(errorMessage) {
  // We need to return 200 here or Firefox won’t display the image
  // HOWEVER a 200 means that if it times out on the first attempt it will stay the default image until the next build.
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}"/>`, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml",
      "x-11ty-error-message": errorMessage,
      "cache-control": `public, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_DAY}`,
    }
  });
}

function getEmptyJsonResponse() {
  return new Response("{}", {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_DAY}`
    }
  })
}

export async function GET(request, context) {
  // e.g. /json/https%3A%2F%2Fwww.11ty.dev%2F/
  let requestUrl = new URL(request.url);
  let [format, url] = requestUrl.pathname.split("/").filter(entry => !!entry);

  if(request.url?.endsWith("favicon.ico")) {
    if(!format || format === "json") {
      return getEmptyJsonResponse();
    } else {
      return getEmptyImageResponse("");
    }
  }

  url = decodeURIComponent(url);

  // short circuit circular requests
  if(isFullUrl(url) && (new URL(url)).hostname.endsWith(".generator.11ty.dev")) {
    if(!format || format === "json") {
      return getEmptyJsonResponse();
    } else {
      return getEmptyImageResponse("Circular request");
    }
  }

  try {
    // output to Function logs
    console.log("Fetching", url);

    let gen = new FindGenerator(url);
    await gen.fetch({
      dryRun: true,
    });

    let generator = gen.findData();

    if(format === "image") {
      let image = await gen.getImage(generator, IMAGE_WIDTH);

      return new Response(image.body, {
        headers: {
          "content-type": image.contentType,
          "x-11ty-generator": generator,
          "cache-control": `public, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_DAY}`
        }
      });
    }

    return new Response(JSON.stringify({ generator }, null, 2), {
			headers: {
				"content-type": "application/json",
				"cache-control": `public, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_DAY}`
			}
		});

  } catch (error) {
    console.log("Error", error);

    if(format === "image") {
      return getEmptyImageResponse(error.message);
    }

    return new Response(JSON.stringify({ error: error.message }, null, 2), {
			status: 500,
			headers: {
				"content-type": "application/json"
			}
		});
  }
}
