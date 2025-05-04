/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token)
            return res.status(403).json({ meesage: "From middleware: Token does not exist."})

        console.log(token);
        console.log(req.headers['authorization']);

        const secret = process.env.JWT_SECRET_KEY
        if(!secret)
            throw new NotFoundException('Secret is empty.');
        
        jwt.verify(token, secret, (err, decoded) => {
            console.log("err: ", err);
            console.log("dec: ", decoded);
            if (err || !decoded) {
              return res.status(403).json({ message: 'Invalid or expired token!' });
            }
      
            console.log("DECODed", decoded);
            req['user'] = decoded;
            console.log(`User authenticated with token: ${token}`);
            next();
          });
        next();
    }
}