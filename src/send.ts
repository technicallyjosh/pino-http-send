import got from 'got';

import { Log } from '.';
import args from './args';
import { logError, logInfo, logWarn } from './log';

function createBody(logs: Log[]) {
  const { bodyType: type } = args;

  if (type === 'ndjson') {
    return {
      body: logs.reduce(
        (body, log) => (body += `${JSON.stringify(log)}\n`),
        '',
      ),
    };
  }

  // default is json
  return { json: { logs } };
}

export default function send(logs: Log[], retries = 0) {
  const max = retries === args.retries;
  // fire and continue
  got(args.url, {
    method: 'POST',
    username: args.username,
    password: args.password,
    ...createBody(logs),
  })
    .then(() => {
      logInfo(`sent ${logs.length} log(s)`);
    })
    .catch(err => {
      logError(err, max ? null : `...retrying in ${args.interval}ms`);

      if (max) {
        logWarn(
          `max retries hit (${args.retries}). dropping logs:`,
          JSON.stringify(logs),
        );
        return;
      }

      retries++;
      setTimeout(() => send(logs, retries), args.interval);
    });
}
