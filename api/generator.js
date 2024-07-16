import FindGenerator from "../find-generator.js";

const ONE_DAY = 60*60*24;
const ONE_WEEK = ONE_DAY*7;

const IMAGE_WIDTH = 60;
const IMAGE_HEIGHT = 60;

export async function GET(request, context) {
  // e.g. /json/https%3A%2F%2Fwww.11ty.dev%2F/
  let requestUrl = new URL(request.url);
  let [format, url] = requestUrl.pathname.split("/").filter(entry => !!entry);

  if(!url || url?.endsWith("favicon.ico")) {
    return;
  }

  url = decodeURIComponent(url);

  try {
    // output to Function logs
    console.log("Fetching", url);

    let gen = new FindGenerator(url);
    await gen.fetch();

    let generator = gen.findData();

    if(format === "image") {
      let image = await gen.getImage(generator, IMAGE_WIDTH);

      return new Response(Buffer.from(image.body, 'base64'), {
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
        // We need to return 200 here or Firefox won’t display the image
        // HOWEVER a 200 means that if it times out on the first attempt it will stay the default image until the next build.
      return new Response(`<svg xmlns="http://www.w3.org/2000/svg" width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}"/>`, {
        headers: {
          "content-type": "image/svg+xml",
          "x-11ty-error-message": error.message,
          "cache-control": `public, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_DAY}`,
        }
      });
    }

    return new Response(JSON.stringify({ error: error.message }, null, 2), {
			status: 500,
			headers: {
				"content-type": "application/json"
			}
		});
  }
}
