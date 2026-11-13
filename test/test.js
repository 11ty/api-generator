import test from "node:test";
import assert from "node:assert/strict";
import FindGenerator from "../find-generator.js";

test("Get info from 11ty.dev", async () => {
  let g = new FindGenerator("https://www.11ty.dev/");
  await g.fetch();

  let content = g.findData();
  assert.ok(content.startsWith("Eleventy"));
});

test("Get image from 11ty.dev", async () => {
  let g = new FindGenerator("https://www.11ty.dev/");
  await g.fetch();
  let content = g.findData();
  assert.ok(content.startsWith("Eleventy"));

  let image = await g.getImage(content);
  assert.ok(image.body);
});

test("Image/info for gatsbyjs.com", async () => {
  let g = new FindGenerator("https://www.gatsbyjs.com/");
  await g.fetch();

  let content = g.findData();
  assert.ok(content.startsWith("Gatsby"));

  let image = await g.getImage(content);
  assert.ok(image.body);
});

test("Image/info for gohugo.io", async () => {
  let g = new FindGenerator("https://gohugo.io/");
  await g.fetch();

  let content = g.findData();
  assert.ok(content.startsWith("Hugo"));

  let image = await g.getImage(content);
  assert.ok(image.body);
});

test("Image/info for nextjs.org", async () => {
  let g = new FindGenerator("https://nextjs.org/");
  await g.fetch();

  let content = g.findData();
  assert.ok(content.startsWith("Next"));

  let image = await g.getImage(content);
  assert.ok(image.body);
});

test("Image/info for nuxt.com", async () => {
  let g = new FindGenerator("https://nuxt.com/");
  await g.fetch();

  let content = g.findData();
  assert.ok(content.startsWith("Nuxt"));

  let image = await g.getImage(content);
  assert.ok(image.body);
});

test("Image/info for vitepress.dev", async () => {
  let g = new FindGenerator("https://vitepress.dev/");
  await g.fetch();

  let content = g.findData();
  assert.ok(content.startsWith("VitePress"));

  let image = await g.getImage(content);
  assert.ok(image.body);
});
