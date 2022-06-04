const test = require("ava");
const FindGenerator = require("../find-generator.js");

test("Get info from 11ty.dev", async t => {
  let generator = new FindGenerator("https://www.11ty.dev/");
  await generator.fetch();
  let {name, version} = generator.findData();

  t.is(name, "Eleventy");
  t.truthy(version);
});

test("Get image from 11ty.dev", async t => {
  let g = new FindGenerator("https://www.11ty.dev/");
  await g.fetch();
  let generator = g.findData();
  let image = await g.getImage(generator);

  t.is(generator.name, "Eleventy");
  t.truthy(image.body);
});

test("Image/info for gatsbyjs.com", async t => {
  let g = new FindGenerator("https://www.gatsbyjs.com/");
  await g.fetch();

  let generator = g.findData();
  let image = await g.getImage(generator);

  t.is(generator.name, "Gatsby");
  t.truthy(generator.version);

  t.truthy(image.body);
});