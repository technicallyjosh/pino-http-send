import chalk from 'chalk';

const prefix = 'pino-http-send';

export function logInfo(message: unknown, ...params: any[]): void {
  console.log(chalk.green(`${prefix} - ${message}`, ...params));
}

export function logWarn(message: unknown, ...params: any[]): void {
  console.warn(chalk.yellow(`${prefix} - ${message}`, ...params));
}

export function logError(message: unknown, ...params: any[]): void {
  console.error(chalk.red(`${prefix} - ${message}`, ...params));
}
