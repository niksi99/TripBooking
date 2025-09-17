/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { ILoggerStrategy } from "../stragies/interfaces/logger.strategy";
import { ConsoleLogger } from "../stragies/implementations/console.logger";
import { FileLogger } from "../stragies/implementations/file.logger";

@Injectable()
export class LoggerService {
private strategies: ILoggerStrategy[];

  constructor() {
    this.strategies = [new ConsoleLogger(), new FileLogger()];
  }

  log(message: string, context?: string) {
    this.strategies.forEach((strategy) => strategy.log(`CORRECT: ${message}`, context));
  }

  error(message: string, context?: string) {
    this.strategies.forEach((strategy) => strategy.log(`ERROR: ${message}`, context));
  }

  warn(message: string, context?: string) {
    this.strategies.forEach((strategy) => strategy.log(`WARN: ${message}`, context));
  }
}