#!/usr/bin/env node
import pump from 'pump';
import split from 'split2';
import through from 'through2';

import { args, loadArgs } from './args';
import { handleLog } from './handle';

import type { Log } from './send';

loadArgs();

function safeParse(src: string): any {
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

const transport = through.obj((log: Log, _enc, callback) => {
  handleLog(log, callback);
});

pump(process.stdin, split(safeParse), transport);
