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