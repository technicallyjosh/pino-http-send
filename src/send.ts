import got, { Method } from 'got';

import { args } from './args';
import { logError, logWarn } from './log';

export type BodyType = 'json' | 'ndjson';

export type Body = {
  body?: string;
  json?: Record<string, unknown> | Record<string, unknown>[];
};

export function createBody(
  logs: Record<string, unknown>[],
  bodyType: BodyType,
  bodyJsonKey: string,
): Body {
  if (bodyType === 'ndjson') {
    return {
      body: logs.reduce(
        (body, log) => (body += `${JSON.stringify(log)}\n`),
        '',
      ),
    };
  }

  // default is json
  if (bodyJsonKey) {
    return { json: { [bodyJsonKey]: logs } };
  }

  return { json: logs };
}

export function send(logs: Record<string, unknown>[], numRetries = 0): void {
  const {
    url,
    method,
    username,
    password,
    headers = {},
    bodyType = 'json',
    bodyJsonKey = 'logs',
    retries = 5,
    interval = 1000,
    silent = false,
  } = args;

  const limitHit = numRetries === retries;

  // fire and forget so we don't await or anything
  got(url, {
    method: method as Method,
    username,
    password,
    headers,
    allowGetBody: true,
    ...createBody(logs, bodyType as BodyType, bodyJsonKey),
  })
    .then()
    .catch(err => {
      if (!silent) {
        logError(err, limitHit ? null : `...retrying in ${interval}ms`);
      }

      if (limitHit) {
        if (!silent) {
          // make sure to stringify to get the whole thing, e.g. don't want
          // cutoffs on deep objects...
          logWarn(
            `max retries hit (${retries}). dropping logs:`,
            JSON.stringify(logs),
          );
        }

        return;
      }

      numRetries++;

      setTimeout(() => send(logs, numRetries), interval);
    });
}
