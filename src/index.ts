#!/usr/bin/env node
import pump from 'pump';
import split from 'split2';
import through, { TransformCallback } from 'through2';

import args from './args';
import send from './send';

export interface Log extends Record<string, any> {
  time: number;
  v: number;
}

let batch: Log[] = [];

export function safeParse(src: string) {
  try {
    const parsed = JSON.parse(src);

    if (args.log) {
      console.log(src);
    }

    return parsed;
  } catch (e) {
    if (args.log) {
      console.log(src);
    }
  }
}

export function handleLog(log: Log, callback?: TransformCallback) {
  batch.push(log);

  if (batch.length === args.batchSize) {
    // send the batch, clear the batch, continue
    send([...batch]);

    batch = [];

    callback?.();
  } else {
    callback?.();
  }
}

const transport = through.obj((log: Log, _enc, callback) => {
  handleLog(log, callback);
});

pump(process.stdin, split(safeParse), transport);
