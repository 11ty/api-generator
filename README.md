<p align="center"><img src="https://www.11ty.dev/img/logo-github.svg" width="200" height="200" alt="11ty Logo"></p>

# api-generator

A runtime service to returns the avatar of the `<meta name="generator">` used on a web site.

This service only supports a few generators (at time of writing: 11ty, Gatsby, and Hugo), but I will happily merge PRs for others!

## Usage

URLs have the formats:

```
/json/:url/
/image/:url/
```

* `url` must be URI encoded.

## Examples

* See the “Built With” column on https://www.speedlify.dev/ssg/
* zachleat.com is built with <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Fwww.zachleat.com/" width="30" height="30" alt="Eleventy">
* 11ty.dev is built with: <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Fwww.11ty.dev/" width="30" height="30" alt="Eleventy">
* gatsbyjs.com is built with: <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Fwww.gatsbyjs.com/" width="30" height="30" alt="Gatsby">
* littlecaesars.com is built with: <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Flittlecaesars.com%2Fen-us%2F/" width="30" height="30" alt="Gatsby">
