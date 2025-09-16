/* eslint-disable prettier/prettier */
import { ILoggerStrategy } from "../interfaces/logger.strategy";

export class ConsoleLogger implements ILoggerStrategy {
    log(message: string, context?: string): void {
        const output = context ? `[${context}] ${message}` : message;
        console.log("CONSOLE LOGGER: " + output);
    }

}