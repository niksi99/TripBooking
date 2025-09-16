/* eslint-disable prettier/prettier */
export interface ILoggerStrategy {
  log(message: string, context?: string): void;
}