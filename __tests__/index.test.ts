import { exec, spawn } from 'child_process';
import http from 'http';

jest.setTimeout(10000);

let server: http.Server;
let body: unknown;

beforeAll(done => {
  server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }

      try {
        body = JSON.parse(Buffer.concat(buffers).toString());
      } catch (err) {
        body = undefined;
      }

      res.statusCode = 200;
      res.end();
    },
  );

  server.listen(4000, done);
});

afterAll(done => {
  server.close(done);
});

it('should error when no url is specified', done => {
  let lines = '';

  const child = exec('node ./dist/bin.js');

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
  const proc = spawn(
    'node',
    ['./dist/bin.js', '--url=http://localhost:4000', '-l'],
    {
      stdio: 'pipe',
    },
  );

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

it('should send the logs over http', done => {
  const proc = spawn('node', ['./dist/bin.js', '--url=http://localhost:4000'], {
    stdio: 'pipe',
  });
  const log = { hello: 'world' };

  proc.stderr.on('data', msg => {
    done(msg);
  });

  proc.on('exit', () => {
    expect(body).toMatchObject({ logs: [log] });
    done();
  });

  proc.stdin.write(Buffer.from(JSON.stringify(log)));
  proc.stdin.end();
});

it('should update the body key using -bjk', done => {
  const proc = spawn(
    'node',
    ['./dist/bin.js', '--url=http://localhost:4000', '--bodyJsonKey=""'],
    {
      stdio: 'pipe',
    },
  );
  const log = { hello: 'world' };

  proc.stderr.on('data', msg => {
    done(msg);
  });

  proc.on('exit', () => {
    expect(body).toMatchObject([log]);
    done();
  });

  proc.stdin.write(Buffer.from(JSON.stringify(log)));
  proc.stdin.end();
});
