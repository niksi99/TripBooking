/* eslint-disable prettier/prettier */

import { ILoggerStrategy } from "../interfaces/logger.strategy";
import * as path from 'path';
import * as fs from 'fs';

export class FileLogger implements ILoggerStrategy {
    private filePath = path.join(process.cwd(), 'logs.txt');

    log(message: string, context?: string) {
    const output = context ? `[${context}] ${message}` : message;
    fs.appendFile(this.filePath, output + '\n', (err) => {
      if (err) console.error('Failed to write log to file:', err);
    });
  }
    
}