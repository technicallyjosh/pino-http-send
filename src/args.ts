import yargs from 'yargs';
import { readFileSync } from 'fs';

export default yargs
  .usage('pino-http-send [options]')
  .env('PINO_HTTP_SEND')
  .option('log', {
    alias: 'l',
    type: 'boolean',
    desc: 'log to console as well',
    default: false,
  })
  .option('bodyType', {
    alias: 'b',
    type: 'string',
    choices: ['json', 'ndjson'],
    desc: 'type of body to send',
    default: 'json',
  })
  .option('logstash', {
    alias: 'ls',
    type: 'boolean',
    desc: 'indicates logs are sent to logstash. `time` becomes `@timestamp`',
    default: false,
  })
  .option('url', {
    type: 'string',
    require: true,
    desc: 'url to send logs to',
  })
  .option('username', {
    alias: 'u',
    type: 'string',
    desc: 'basic auth username',
  })
  .option('password', {
    alias: 'p',
    type: 'string',
    desc: 'basic auth password',
  })
  .option('batchSize', {
    alias: 's',
    type: 'number',
    desc: 'how many logs to send at a time',
    default: 10,
  })
  .option('retries', {
    alias: 'r',
    type: 'number',
    desc: 'number of retries to do if failure',
    default: 5,
  })
  .option('interval', {
    alias: 'i',
    type: 'number',
    desc: 'interval (in ms) to retry sending if failure',
    default: 1000,
  })
  .option('timeout', {
    alias: 't',
    type: 'number',
    desc: 'timeout (in ms) to send logs in bucket that are not filled',
    default: 5000,
  })
  .option('config', {
    alias: 'c',
    type: 'string',
    desc: 'path to json config',
    config: true,
    configParser: path => JSON.parse(readFileSync(path, 'utf8')),
  })
  .parse();
