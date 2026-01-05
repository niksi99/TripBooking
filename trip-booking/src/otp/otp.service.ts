/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { OTPType } from './types/otp.type';

@Injectable()
export class OtpService {

    constructor(
        @InjectRepository(OTP)
        private otpRepository: Repository<OTP>
    ){}

    async generateOTP(user: User, type: OTPType) {
        const otp = crypto.randomInt(Number(process.env.OTP_LOWER_BOUNDARY), Number(process.env.OTP_UPPER_BOUNDARY)).toString();
        const hashedOTP = await bcrypt.hash(otp, 10)
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

        console.log(otp, " PFKL Expires at", expiresAt);
        console.log("\n\n");

        const newOTP = this.otpRepository.create({
            user,
            token: hashedOTP,
            type,
            expiresAt
        })

        await this.otpRepository.save(newOTP);
        return {
            user,
            otp
        };
    }
}
