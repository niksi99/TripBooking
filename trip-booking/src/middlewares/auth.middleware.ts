/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("req.headers", req.headers);
        //const token = req.headers['authorization']?.split(' ')[1];
        const token = req.headers.cookie?.split("=")[1]//req.headers.cookie?.split("=")[1].split(".")[1].concat("." + req.headers.cookie?.split("=")[1].split(".")[2]).split("-")[0];
        //const tokenEncoded = decodeURIComponent(token);
        console.log("TOKEN", req.headers.cookie?.split("=")[1]);
        if(!token)
            return res.status(403).json({ meesage: "From middleware: Token does not exist."})

        const secret = process.env.JWT_SECRET_KEY
        if(!secret)
            throw new NotFoundException('From middleware: Secret is empty.');
        
        const tokenEncoded = decodeURIComponent(token);
        console.log("TOKEN", tokenEncoded);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const jsonParsedToken: string = JSON.parse(tokenEncoded.slice(2))[0];
        console.log("JSON PARSE TOKEN", jsonParsedToken);
        jwt.verify(jsonParsedToken, secret, (err, decoded) => {
            console.log("token in verify", jsonParsedToken);
            console.log("decoded in verify", decoded);
            console.log("err in verify", err);
            if (err || !decoded) {
              return res.status(403).json({ message: `From middleware: ${err?.message}` });
            }
      
            req['user'] = decoded;
            next();
          });
        //next();
    }
}