import { readFileSync } from 'fs';
import yargs from 'yargs';

export type Args = {
  url: string;
  log?: boolean;
  silent?: boolean;
  method?: string;
  bodyType?: string;
  bodyJsonKey?: string;
  username?: string;
  password?: string;
  headers?: Record<string, string>;
  batchSize?: number;
  retries?: number;
  interval?: number;
  timeout?: number;
  config?: string;
};

/**
 * Used with API and not with CLI...
 */
const defaultArgs: Args = {
  log: false,
  silent: true,
  method: 'POST',
  bodyType: 'json',
  bodyJsonKey: 'logs',
  url: '',
  batchSize: 10,
  retries: 5,
  interval: 1000,
  timeout: 5000,
};

export let args: Args;

/**
 * On demand loading of args since CLI would conflict with the loading of these.
 */
export function loadArgs(): Args {
  args = yargs
    .usage('pino-http-send [options]')
    .env('PINO_HTTP_SEND')
    .option('log', {
      alias: 'l',
      type: 'boolean',
      desc: 'log to console as well',
      default: false,
    })
    .option('silent', {
      type: 'boolean',
      desc: 'silence pino-http-send logs for failures and retries',
      default: false,
    })
    .option('method', {
      alias: 'm',
      type: 'string',
      choices: ['POST', 'PUT', 'PATCH', 'GET'],
      group: 'Sending',
      default: 'POST',
    })
    .option('bodyType', {
      alias: 'b',
      type: 'string',
      choices: ['json', 'ndjson'],
      desc: 'type of body to send',
      group: 'Sending',
      default: 'json',
    })
    .option('bodyJsonKey', {
      alias: 'bjk',
      type: 'string',
      desc: 'root key for the logs array',
      group: 'Sending',
      default: 'logs',
    })
    .option('url', {
      type: 'string',
      require: true,
      group: 'Sending',
      desc: 'url to send logs to',
    })
    .option('username', {
      alias: 'u',
      type: 'string',
      desc: 'basic auth username',
      group: 'Basic Auth',
    })
    .option('password', {
      alias: 'p',
      type: 'string',
      desc: 'basic auth password',
      group: 'Basic Auth',
    })
    .option('batchSize', {
      alias: 's',
      type: 'number',
      desc: 'how many logs to send at a time',
      group: 'Sending',
      default: 10,
    })
    .option('retries', {
      alias: 'r',
      type: 'number',
      desc: 'number of retries to do if failure',
      group: 'Retry',
      default: 5,
    })
    .option('interval', {
      alias: 'i',
      type: 'number',
      desc: 'interval (in ms) to retry sending if failure',
      group: 'Retry',
      default: 1000,
    })
    .option('timeout', {
      alias: 't',
      type: 'number',
      desc: 'timeout (in ms) to send logs in bucket that are not filled',
      group: 'Sending',
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

  return args;
}

/**
 * Sets args to passed in values defaulting to above defaults.
 * Used in CLI ONLY.
 * @param newArgs
 */
export function setArgs(newArgs: Partial<Args>): void {
  args = {
    ...defaultArgs,
    ...newArgs,
  };
}
