const fetch = require("node-fetch");
const cheerio = require("cheerio");
const EleventyImage = require("@11ty/eleventy-img");

const Generators = {
  eleventy: "https://www.11ty.dev/",
  "11ty": "https://www.11ty.dev/",
  hugo: "https://gohugo.io/",
  gatsby: "https://www.gatsbyjs.com/",
  wordpress: "https://wordpress.com/",
  silex: "https://www.silex.me/",
  jekyll: "https://jekyllrb.com/",
  docusaurus: "https://docusaurus.io/",
  gridsome: "https://gridsome.org/",
  vuepress: "https://vuepress.vuejs.org/",
  hexo: "https://hexo.io/",
  phenomic: "http://www.phenomic.io/",
}

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
      return value;
    }
  }

  getImageUrl(generatorName) {
    generatorName = generatorName.toLowerCase();
    
    let url;
    for(let key in Generators) {
      if(generatorName.includes(key)) {
        url = Generators[key];
        break;
      }
    }

    if(url) {
      return `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(url)}/`;
    } else {
      // found a generator name but was not supported
      if(generatorName) {
        // notably this is different than no generator found (error state is a transparent image)
        return "./x.svg";
      }

      throw new Error("No indieweb avatar known for generator: " + generatorInfo.name);
    }
  }

  async getImage(generatorName, width) {
    let imageUrl = this.getImageUrl(generatorName);

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
