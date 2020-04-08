import { exec, spawn } from 'child_process';
import nock from 'nock';

jest.setTimeout(10000);

beforeAll(() => {
  nock('http://localhost:4000').post('/', () => {
    return true;
  });
});

it('should error when no url is specified', done => {
  let lines = '';

  const child = exec('node .');

  child.stderr?.on('data', data => {
    lines += data;
  });

  child.on('close', code => {
    expect(code).toBe(1);
    expect(lines).toMatch('Missing required argument: url');
    done();
  });
});

it('should log with -l', done => {
  const proc = spawn('node', ['.', '--url=http://localhost:4000', '-l'], {
    stdio: 'pipe',
  });

  proc.stdout.on('data', msg => {
    expect(msg.toString()).toBe('test\n');
  });

  proc.stderr.on('data', msg => {
    done(msg);
  });

  proc.on('exit', () => {
    done();
  });

  proc.stdin.write(Buffer.from('test'));
  proc.stdin.end();
});
