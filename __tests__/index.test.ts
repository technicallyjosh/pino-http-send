import { spawn } from 'child_process';

describe('cli', () => {
  it('should error when no url is specified', done => {
    let lines = '';

    const child = spawn('node .');

    child.stderr
      .on('data', data => {
        lines += data;
      })
      .on('end', () => {
        expect(lines).toMatch('Missing required argument: url');
        done();
      });
  });
});
