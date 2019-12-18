# pino-http-send

A basic handler for [pino](https://github.com/pinojs/pino) logs that sends batches to a desired
endpoint via HTTP or HTTPS.

[![npm](https://img.shields.io/npm/v/pino-http-send.svg?style=for-the-badge)](https://npmjs.com/package/pino-http-send)
[![Travis (.org)](https://img.shields.io/travis/technicallyjosh/pino-http-send.svg?style=for-the-badge)](https://travis-ci.org/technicallyjosh/pino-http-send)
[![David](https://img.shields.io/david/technicallyjosh/pino-http-send.svg?style=for-the-badge)](https://david-dm.org/technicallyjosh/pino-http-send)

**_Pre v1 is subject to breaking changes on minor version change._**

## Installation

```console
$ npm i pino-http-send
```

## Usage

```console
pino-http-send [options]

Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --log, -l        log to console as well             [boolean] [default: false]
  --bodyType, -b   type of body to send
                          [string] [choices: "json", "ndjson"] [default: "json"]
  --url            url to send logs to                       [string] [required]
  --username, -u   basic auth username                                  [string]
  --password, -p   basic auth password                                  [string]
  --batchSize, -s  how many logs to send at a time        [number] [default: 10]
  --retries, -r    number of retries to do if failure      [number] [default: 5]
  --interval, -i   interval (in ms) to retry sending if failure
                                                        [number] [default: 1000]
  --timeout, -t    timeout (in ms) to send logs in bucket that are not filled
                                                        [number] [default: 5000]
  --config, -c     path to json config                                  [string]
```

## Environment Variables

All options can be defined in the environment and are prefixed with `PINO_HTTP_SEND_`. All
camel-cased options are parsed with delimiters of `_`.

_e.g. The option `batchSize` as an env var would be `PINO_HTTP_SEND_BATCH_SIZE`._

## URL

**Example**

```console
$ node . | pino-http-send --url localhost:8080
```

You can also do https...

```console
$ node . | pino-http-send --url https://myserver.com:8080
```

## Auth

Currently only basic auth is implemented. Tokens and other fun stuff will come later.
