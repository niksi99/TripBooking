/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  run(callback: () => void) {
    this.asyncLocalStorage.run(new Map(), callback);
  }

  set(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get<T>(key: string): T | undefined {
    const store = this.asyncLocalStorage.getStore();
    return store ? (store.get(key) as T) : undefined;
  }
}
