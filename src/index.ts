import Pumpify from 'pumpify';
import split from 'split2';
import through from 'through2';

import { Args, setArgs } from './args';
import { handleLog } from './handle';

/**
 * Safely parses incoming JSON and logs the source if an error is thrown.
 * @param src
 */
function safeParse(src: string): any {
  try {
    const parsed = JSON.parse(src);

    return parsed;
  } catch (e) {
    console.log(src);
  }
}

/**
 * Passes the incoming stream through the proper callback.
 * @param args
 */
function streamHandler() {
  return through.obj((log, _enc, callback) => {
    handleLog(log, callback);
  });
}

/**
 * Creates a writable stream that handles logs, batches them, and then sends
 * them to the configured endpoint.
 * @param options
 */
export function createWriteStream(args: Args): Pumpify {
  // make sure url is defined right away
  if (!args.url || !args.url.trim()) {
    throw new Error('args.url is required');
  }

  setArgs(args);

  return new Pumpify(split(safeParse), streamHandler());
}
