const test = require("ava");
const FindGenerator = require("../find-generator.js");

test("Get info from 11ty.dev", async t => {
  let g = new FindGenerator("https://www.11ty.dev/");
  await g.fetch();

  let content = g.findData();
  t.true(content.startsWith("Eleventy"));
});

test("Get image from 11ty.dev", async t => {
  let g = new FindGenerator("https://www.11ty.dev/");
  await g.fetch();
  let content = g.findData();
  t.true(content.startsWith("Eleventy"));

  let image = await g.getImage(content);
  t.truthy(image.body);
});

test("Image/info for gatsbyjs.com", async t => {
  let g = new FindGenerator("https://www.gatsbyjs.com/");
  await g.fetch();

  let content = g.findData();
  t.true(content.startsWith("Gatsby"));

  let image = await g.getImage(content);
  t.truthy(image.body);
});

test("Image/info for gohugo.io", async t => {
  let g = new FindGenerator("https://gohugo.io/");
  await g.fetch();

  let content = g.findData();
  t.true(content.startsWith("Hugo"));

  let image = await g.getImage(content);
  t.truthy(image.body);
});
