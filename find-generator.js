import * as cheerio from "cheerio";
import Image from "@11ty/eleventy-img";
import Fetch from "@11ty/eleventy-fetch";

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
  astro: "https://astro.build/",
  lume: "https://lume.land/",
  next: "https://nextjs.org/",
  nuxt: "https://nuxt.com/",
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

  async fetch(fetchOptions = {}) {
    let opts = Object.assign({
      type: "text",
    }, fetchOptions);

    let response = await Fetch(this.url, opts);

    this.$ = cheerio.load(response);

    return response;
  }

  // <meta name="generator" content="Eleventy v2.0.0">
  findData(rawData) {
    if(rawData) {
      if(typeof rawData !== "string") {
        throw new Error("Argument passed to `findData` must be an HTML string.");
      }

      this.$ = cheerio.load(rawData);
    } else if(!this.$) {
      throw new Error("You need to call `fetch()` first.");
    }

    let metas = this.$("meta[name='generator']");

    for(let meta of metas) {
      let value = meta.attribs.content;
      return value;
    }

    // Guess for Next.js
    let nextScripts = this.$("script[src^='/_next/']");
    if(nextScripts.length) {
      return "Next";
    }

    // Guess for Nuxt
    let nuxtScripts = this.$("script[src^='/_nuxt/']");
    if(nuxtScripts.length) {
      return "Nuxt";
    }

    throw new Error("No <meta name='generator' content> element found.");
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

    let stats = await Image(imageUrl, {
      widths: [width],
      formats: ["auto"],
      dryRun: true,
    });

    let format = Object.keys(stats).pop();
    let stat = stats[format][0];

    return {
      format: format,
      contentType: stat.sourceType,
      body: stat.buffer,
    }
  }
}

export default FindGenerator;
