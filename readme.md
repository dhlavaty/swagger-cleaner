# swagger-cleaner

Command line tool and utility for cleaning up (not only) swagger.json files. Used for better comparison and diff of your swagger.

## Why

Because reading diff of `swagger.json` files is often very hard. It can be even harder if swagger.json is auto-generated. It's JSON structure ordering can vary, `example` part can contain a lot-of stuff that makes diff even harder to read.

`swagger-cleaner` is here to help. It cleans your swagger.json so diff is easier to read.

## Usage

### Running on-demand

Using `npx` you can run the script without installing it:

```
npx swagger-cleaner <url> --save-raw raw-file.json > clean-file.json
```

this will download `swagger.json` from `<url>`, saves it into `raw-file.json` and saves cleaned version into `clean-file.json`.

### Other options

For all command line options run:

```
npx swagger-cleaner
```

## How it works

Assume script is started as:

```
swagger-cleaner http://example.com/swagger.json --save-raw raw-file.json > clean-file.json
```

1. Script will fetch json file from `http://example.com/swagger.json` address
1. It saves raw json file into `raw-file.json` (can be omited)
1. Cleans JSON, so that output is deterministic - a.k.a. always sorted the same way. (We use [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify) lib for this)
1. Removes every `example` part from JSON file (this can be disabled with `--keep-examples` option)
1. Saves output into `clean-file.json` file

## How author use it

As frontend developers with several projects, we (our team) keep all `swagger.json` files, of all backend services we use, in our frontend projects repositories. As backend services are our dependencies, we need to be sure, that we know about any change on backend. That's why we regularly check diffs of `swagger.json` files. And to be sure, diffs are as-human-readable-as-possible we use `swagger-cleaner`.

By using `--keep-examples` option, you can clean-up any JSON file.
