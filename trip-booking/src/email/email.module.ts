/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from 'src/otp/otp.module';

@Module({
    imports: [ConfigModule, OtpModule],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
