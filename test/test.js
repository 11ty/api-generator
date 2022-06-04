const test = require("ava");
const FindGenerator = require("../find-generator.js");

test("Standard", async t => {
  let generator = new FindGenerator("https://www.11ty.dev/");
  await generator.fetch();
  let {name, version} = generator.findData();

  t.is(name, "Eleventy");
  t.truthy(version);
});

test("Get Image", async t => {
  let g = new FindGenerator("https://www.11ty.dev/");
  await g.fetch();
  let generator = g.findData();
  let image = await g.getImage(generator);

  t.is(generator.name, "Eleventy");
  t.truthy(image.body);
});