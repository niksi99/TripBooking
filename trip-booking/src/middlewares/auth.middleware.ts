/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.cookie?.split("=")[1]
        if(!token)
            return res.status(403).json({ meesage: "From middleware: Token does not exist."})

        const secret = process.env.JWT_SECRET_KEY
        if(!secret)
            throw new NotFoundException('From middleware: Secret is empty.');
        
        const tokenEncoded = decodeURIComponent(token);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const jsonParsedToken: string = JSON.parse(tokenEncoded.slice(2))[0];
        jwt.verify(jsonParsedToken, secret, (err, decoded) => {
            if (err || !decoded) {
              return res.status(403).json({ message: `From middleware: ${err?.message}` });
            }
      
            req['user'] = decoded;
            next();
          });
        //next();
    }
}