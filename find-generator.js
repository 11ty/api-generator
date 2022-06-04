const fetch = require("node-fetch");
const cheerio = require("cheerio");
const EleventyImage = require("@11ty/eleventy-img");

class FindGenerator {
  constructor(url) {
    this.url = url;

    if(!this.isFullUrl(url)) {
      throw new Error(`Invalid \`url\`: ${url}`);
    }
  }

  isFullUrl(url) {
    try {
      new URL(url);
      return true;
    } catch(e) {
      // invalid url OR local path
      return false;
    }
  }

  async fetch() {
    let response = await fetch(this.url);
    let body = await response.text();
    this.body = body;

    this.$ = cheerio.load(body);
    return body;
  }

  // <meta name="generator" content="Eleventy v2.0.0">
  findData() {
    let metas = this.$("meta[name='generator']");

    for(let meta of metas) {
      let value = meta.attribs.content;
      let info = value.split(" ").map(entry => entry.trim());
      let version = info.pop();
      let name = info.join(" ");

      return {
        name,
        version
      }
    }
  }

  getImageUrl(generatorInfo) {
    let url;
    let name = generatorInfo && generatorInfo.name.toLowerCase();
    if(name === "eleventy") {
      url = "https://www.11ty.dev/";
    } else if(name === "gatsby") {
      url = "https://www.gatsbyjs.com/";
    } else if(name === "hugo") {
      url = "https://gohugo.io/";
    } else if(name) {
      // found a generator name but was not supported
      // notably this is different than no generator found (error state is a transparent image)
      return `./x.svg`
    }

    if(!url) {
      throw new Error("No indieweb avatar known for generator: " + generatorInfo.name);
    }

    return `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(url)}/`;
  }

  async getImage(generatorInfo, width) {
    let imageUrl = this.getImageUrl(generatorInfo);

    let stats = await EleventyImage(imageUrl, {
      widths: [width],
      formats: ["auto"],
      dryRun: true,
    });

    let format = Object.keys(stats).pop();
    let stat = stats[format][0];

    return {
      format: format,
      contentType: stat.sourceType,
      body: stat.buffer.toString("base64"),
    }
  }
}

module.exports = FindGenerator;
