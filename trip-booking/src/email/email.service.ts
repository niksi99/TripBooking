/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDTO } from './dto/send-email.dto';
import { User } from 'src/users/entities/user.entity';
import { OTPType } from 'src/otp/types/otp.type';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService,
        private readonly otpService: OtpService
    ) {}

    emailTransportConfiguration() {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        return transporter;
    }

    async sendEmail(dto: SendEmailDTO) {
        const { recipients, subject, html } = dto;

    const transport = this.emailTransportConfiguration();

    const options: nodemailer.SendMailOptions = {
      from: process.env.FROM,
      to: recipients,
      subject: subject,
      html: html,
    };
    try {
      await transport.sendMail(options);
      return {
        message: "Email is sent successfully."
      }
    } catch (error) {
      console.log('Error sending mail: ', error);
    }
    }

    async emailVerification(user: User, otpType: OTPType) {
    const token = await this.otpService.generateOTP(user, otpType);

    if (otpType === OTPType.OTP) {
      const emailDto = {
        recipients: [user.email],
        subject: 'OTP for verification',
        html: `Your otp code is: <strong>${token.otp}</strong>.
      <br />Provide this otp to verify your account`,
      };

      //send otp via email
      return await this.sendEmail(emailDto);
    } 
  }
}
