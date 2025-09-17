/* eslint-disable prettier/prettier */

import { ILoggerStrategy } from "../interfaces/logger.strategy";
import * as path from 'path';
import * as fs from 'fs';

export class FileLogger implements ILoggerStrategy {
    private filePath = path.join(process.cwd(), 'logs.txt');

    log(message: string, context?: string) {

    const date = new Date();
    const formatted = `${date.getDate().toString().padStart(2,'0')}.` +
                  `${(date.getMonth()+1).toString().padStart(2,'0')}.` +
                  `${date.getFullYear()} ` +
                  `${date.getHours().toString().padStart(2,'0')}:` +
                  `${date.getMinutes().toString().padStart(2,'0')}:` +
                  `${date.getSeconds().toString().padStart(2,'0')}`;
    const output = context ? `[${context}] ${message} [${formatted}]` : message;
    fs.appendFile(this.filePath, output + '\n', (err) => {
      if (err) console.error('Failed to write log to file:', err);
    });
  }
    
}