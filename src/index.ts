#!/usr/bin/env node
import pump from 'pump';
import split from 'split2';
import through from 'through2';

import args from './args';
import send from './send';

export interface Log extends Record<string, any> {
  time: number;
  v: number;
}

let batch: Log[] = [];

function safeParse(src: string) {
  try {
    return JSON.parse(src);
  } catch (e) {
    if (args.log) {
      console.log(src);
    }
  }
}

function configureLog(log: Log) {
  log['@timestamp'] = log.time;
  delete log.time;
}

const transport = through.obj((log: Log, _enc, callback) => {
  if (args.log) {
    console.log(log);
  }

  if (args.logstash) {
    // configure for sending
    configureLog(log);
  }

  batch.push(log);

  if (batch.length === args.batchSize) {
    // send the batch, clear the batch, continue
    send([...batch]);

    batch = [];

    callback();
  } else {
    callback();
  }
});

pump(process.stdin, split(safeParse), transport);
