/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDTO } from './dto/send-email.dto';

@Injectable()
export class EmailService {
    constructor(
        private readonly configService: ConfigService
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
}
