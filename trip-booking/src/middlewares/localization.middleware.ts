/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RequestLocalStorageService } from "src/local-storage-service/request.local.storage.service";

@Injectable()
export class LocalizationMiddleware implements NestMiddleware {
    constructor(private readonly requestLocalStoreService: RequestLocalStorageService) {}
    use(req: Request, res: Response, next: NextFunction) {
        this.requestLocalStoreService.run(() => {
            this.requestLocalStoreService.set('locale_lang', req.headers['accept-language']);
            next();
        });
  }
}