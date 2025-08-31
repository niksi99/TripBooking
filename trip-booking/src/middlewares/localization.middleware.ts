/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RequestContextService } from "src/context-service/request.context.service";

@Injectable()
export class LocalizationMiddleware implements NestMiddleware {
    constructor(private readonly requestContextService: RequestContextService) {}
    use(req: Request, res: Response, next: NextFunction) {
        this.requestContextService.run(() => {
            this.requestContextService.set('locale_lang', req.headers['accept-language']);
            next();
        });
  }
}