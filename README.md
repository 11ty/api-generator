<p align="center"><img src="https://www.11ty.dev/img/logo-github.svg" width="200" height="200" alt="11ty Logo"></p>

# api-generator

A runtime service to returns the avatar of the `<meta name="generator">` used on a web site.

This service only supports 11ty and Gatsby right now, but I will happily merge PRs for others!

## Usage

URLs have the formats:

```
/json/:url/
/image/:url/
```

* `url` must be URI encoded.

## Examples

* zachleat.com is built with <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Fwww.zachleat.com/">
* 11ty.dev is built with: <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Fwww.11ty.dev/">
* gatsbyjs.com is built with: <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Fwww.gatsbyjs.com/">
* littlecaesars.com is built with: <img src="https://v1.generator.11ty.dev/image/https%3A%2F%2Flittlecaesars.com%2Fen-us%2F/">
