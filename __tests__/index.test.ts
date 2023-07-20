import { exec, spawn } from 'child_process';
import { echo } from 'shelljs';
import http from 'http';

jest.setTimeout(10000);

describe('CLI tests', () => {
  let mockBody: any = {};
  let body: undefined | Record<string, unknown>[];
  let server: http.Server;

  const mockServerPort = 4000;
  const cliExecCommand = './dist/bin.js';
  const baseCLitOptions = [
    `--url=http://localhost:${mockServerPort}`,
    `--retries=0`,
  ];

  beforeAll(done => {
    server = http.createServer(
      async (req: http.IncomingMessage, res: http.ServerResponse) => {
        const buffers = [];

        for await (const chunk of req) {
          buffers.push(chunk);
        }

        try {
          body = JSON.parse(Buffer.concat(buffers).toString());
          mockBody = body;
        } catch (err) {
          body = undefined;
        }

        res.statusCode = 200;
        res.end();
      },
    );

    server.listen(mockServerPort, done);
  });

  afterAll(done => {
    server.close(done);
  });

  describe('option "--url / -u"', () => {
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
  });

  describe('option "--log / -l"', () => {
    it('should log when the option is set', done => {
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
  });

  describe('option "--jsonPayloadBaseType / -j"', () => {
    it('should set the base json payload to an array when the option is set to array', async done => {
      try {
        echo('{"foo": "bar"}').exec(
          `${cliExecCommand} ${baseCLitOptions.join(
            ' ',
          )} --jsonPayloadBaseType=array`,
          (_code, _stdout, stderr) => {
            if (stderr) {
              console.error('CLI stderr', stderr);
            }

            expect(Array.isArray(mockBody)).toBe(true);

            done();
          },
        );
      } catch (error) {
        console.error('Something went wrong during CLI execution', error);
        done();
      }
    });

    it('should set the base json payload to an object when the option is set to object', async done => {
      try {
        echo('{"foo": "bar"}').exec(
          `${cliExecCommand} ${baseCLitOptions.join(
            ' ',
          )} --jsonPayloadBaseType=object`,
          (_code, _stdout, stderr) => {
            if (stderr) {
              console.error('CLI stderr', stderr);
            }

            expect(mockBody instanceof Object).toBe(true);
            expect(Array.isArray(mockBody)).toBe(false);

            done();
          },
        );
      } catch (error) {
        console.error('Something went wrong during CLI execution', error);
        done();
      }
    });

    it('should set the base json payload to an object when the option is not specified', async done => {
      try {
        echo('{"foo": "bar"}').exec(
          `${cliExecCommand} ${baseCLitOptions.join(' ')}`,
          (_code, _stdout, stderr) => {
            if (stderr) {
              console.error('CLI stderr', stderr);
            }

            expect(mockBody instanceof Object).toBe(true);
            expect(Array.isArray(mockBody)).toBe(false);

            done();
          },
        );
      } catch (error) {
        console.error('Something went wrong during CLI execution', error);
        done();
      }
    });
  });
});
