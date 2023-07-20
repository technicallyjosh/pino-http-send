import got, { Method } from 'got';

import { args } from './args';
import { logError, logWarn } from './log';

export type BodyType = 'json' | 'ndjson';
export type jsonPayloadBaseType = 'array' | 'object';

export type Body = {
  body?: string;
  json?: { logs: unknown } | { logs: unknown }[];
};

export interface CreateBodyOptions {
  bodyType: BodyType;
  jsonPayloadBaseType: jsonPayloadBaseType;
}

export function createBody(
  logs: Record<string, unknown>[],
  { bodyType, jsonPayloadBaseType }: CreateBodyOptions,
): Body {
  if (bodyType === 'ndjson') {
    return {
      body: logs.reduce((body, log) => `${body}${JSON.stringify(log)}\n`, ''),
    };
  }

  const baseResponse = { logs };

  // default is json
  if (jsonPayloadBaseType === 'array') {
    return { json: [baseResponse] };
  }
  return { json: { logs } };
}

export function send(logs: Record<string, unknown>[], numRetries = 0): void {
  const {
    url,
    method,
    username,
    password,
    headers = {},
    bodyType = 'json',
    jsonPayloadBaseType = 'object',
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
    ...createBody(logs, {
      bodyType: bodyType as BodyType,
      jsonPayloadBaseType: jsonPayloadBaseType as jsonPayloadBaseType,
    }),
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
