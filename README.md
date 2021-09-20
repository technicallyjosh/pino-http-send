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
$ pino-http-send --help
pino-http-send [options]

Sending
  --method, -m
             [string] [choices: "POST", "PUT", "PATCH", "GET"]  [default: "POST"]
  --bodyType, -b       type of body to send
                          [string] [choices: "json", "ndjson"]  [default: "json"]
  --bodyJsonKey, -bjk  type of body to send            [string] [default: "logs"]
  --url                url to send logs to                    [string] [required]
  --batchSize, -s      how many logs to send at a time     [number] [default: 10]
  --timeout, -t        timeout (in ms) to send logs in bucket that are not filled
                                                         [number] [default: 5000]

Basic Auth
  --username, -u  basic auth username                                   [string]
  --password, -p  basic auth password                                   [string]

Retry
  --retries, -r   number of retries to do if failure       [number] [default: 5]
  --interval, -i  interval (in ms) to retry sending if failure
                                                        [number] [default: 1000]

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --log, -l     log to console as well                [boolean] [default: false]
  --silent      silence pino-http-send logs for failures and retries
                                                      [boolean] [default: false]
  --config, -c  path to json config                                     [string]
```

## Environment Variables

All options can be defined in the environment and are prefixed with `PINO_HTTP_SEND_`. All
camel-cased options are parsed with delimiters of `_`.

_e.g. The option `batchSize` as an env var would be `PINO_HTTP_SEND_BATCH_SIZE`._

## URL

**Example**

```console
$ node . | pino-http-send --url=http://localhost:8080
```

You can also do https...

```console
$ node . | pino-http-send --url=https://myserver.com:8080
```

## Body Type

- `ndjson` - New-line delimited JSON. See [ndjson](https://github.com/ndjson/ndjson-spec)
- `json` - Standard JSON sending of data. Logs are sent in the format of
  ```json
  {
    "logs": [...logs]
  }
  ```

## JSON body key

The root key used to format the body of the request

```json
{
  [bodyJsonKey]: [...logs]
}
```

If an empty string is passed the json body will be the array of logs

```json
[...logs]
```

## Auth

Currently only basic auth is implemented for the CLI usage. For header usage, you can see the API usage.

## API

You can also use this module as a [pino destination](https://github.com/pinojs/pino/blob/master/docs/api.md#destination).

This will use the same batching function like the CLI usage. If the batch length
is not reached within a certain time (`timeout`), it will auto "flush".

### `createWriteStream`

The options passed to this follow the same values as the CLI defined above.

| Property    | Type                    | Required/Default |
| ----------- | ----------------------- | ---------------- |
| url         | `string`                | REQUIRED         |
| log         | `boolean`               | false            |
| silent      | `boolean`               | false            |
| method      | `string`                | "POST"           |
| bodyType    | `string`                | "json"           |
| bodyJsonKey | `string`                | "logs"           |
| username    | `string`                |                  |
| password    | `string`                |                  |
| headers     | `Record<string,string>` |                  |
| batchSize   | `number`                | 10               |
| retries     | `number`                | 5                |
| interval    | `number`                | 1000             |
| timeout     | `number`                | 5000             |
| config      | `string`                |                  |

```ts
import { createWriteStream } from 'pino-http-send';

const stream = createWriteStream({
  url: 'http://localhost:8080',
});

const logger = pino(
  {
    level: 'info',
  },
  stream,
);

logger.info('test log!');
```
