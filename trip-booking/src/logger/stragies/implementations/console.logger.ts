/* eslint-disable prettier/prettier */
import { ILoggerStrategy } from "../interfaces/logger.strategy";

export class ConsoleLogger implements ILoggerStrategy {
    log(message: string, context?: string): void {
        const RESET = "\x1b[0m";
        const RED = "\x1b[31m";
        const YELLOW = "\x1B[33m";
        const BOLD = "\x1b[1m";

        const date = new Date();
        const formatted = `${date.getDate().toString().padStart(2,'0')}.` +
                  `${(date.getMonth()+1).toString().padStart(2,'0')}.` +
                  `${date.getFullYear()} ` +
                  `${date.getHours().toString().padStart(2,'0')}:` +
                  `${date.getMinutes().toString().padStart(2,'0')}:` +
                  `${date.getSeconds().toString().padStart(2,'0')}`;
        const output = context ? `[${RED}${context}${RESET}] ${YELLOW}${message}${RESET} [${BOLD}${formatted}]` : message;
        console.log("CONSOLE LOGGER: " + output);
    }

}