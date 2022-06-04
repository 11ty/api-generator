const fetch = require("node-fetch");
const cheerio = require("cheerio");

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
  findMetaGenerator() {
    let metas = this.$("meta[name='generator']");

    for(let meta of metas) {
      let value = meta.attribs.content;
      let [name, version] = value.split(" v").map(entry => entry.trim());

      return {
        name,
        version
      }
    }
  }
}

module.exports = FindGenerator;
