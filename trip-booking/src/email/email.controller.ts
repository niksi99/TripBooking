/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDTO } from './dto/send-email.dto';
import { EmailService } from './email.service';
import { ResendOTPUser } from './dto/resend-otp-user.dto';
import { OtpService } from 'src/otp/otp.service';
import { UsersService } from 'src/users/users.service';
import { OTPType } from 'src/otp/types/otp.type';

@Controller('email')
export class EmailController {

    constructor(
        private emailService: EmailService,
        private otpService: OtpService,
        private userService: UsersService,
    ) {}

    @Post("/send")
    async sendEmail(@Body() dto: SendEmailDTO) {
        await this.emailService.sendEmail(dto);
        return {
            message: "Email sent successfully."
        }
    }

    @Post("/resend-otp")
    async resendOtp(@Body() dto: ResendOTPUser) {
        const user = await this.userService.findOneByEmail(dto.email);
        const result = await this.emailService.emailVerification(user, OTPType.OTP)
        return {
            message: `EEmail sent successfully.`,
            result
        }
    }
}
