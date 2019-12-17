import chalk from 'chalk';

const pfx = 'pino-http-send';

export function logInfo(message: any, ...params: any[]) {
  console.log(chalk.green(`${pfx} - ${message}`, ...params));
}

export function logWarn(message: any, ...params: any[]) {
  console.warn(chalk.yellow(`${pfx} - ${message}`, ...params));
}

export function logError(message: any, ...params: any[]) {
  console.error(chalk.red(`${pfx} - ${message}`, ...params));
}
