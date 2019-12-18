import { exec } from 'child_process';

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
