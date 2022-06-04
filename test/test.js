const test = require("ava");
const FindGenerator = require("../find-generator.js");

test("Standard", async t => {
  let generator = new FindGenerator("https://www.11ty.dev/");
  await generator.fetch();
  let {name, version} = generator.findMetaGenerator();

  t.is(name, "Eleventy");
  t.truthy(version);
});