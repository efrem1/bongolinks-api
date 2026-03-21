import {FileSystem} from "../FileSystem";
const nodemailer = require('nodemailer');
require('dotenv').config();


export class Mailer {
    /**
     *
     * @param to
     * @param token
     */
    public static async sendVerificationEmail(to: string, token: string): Promise<boolean> {
        const body = await Mailer.getBody("./mail/templates/verification.html", [
            {key: "token", value: token},
        ]);
        const text = `Your verification code is: ${token}. This code will expire in 10 minutes.`;
        return await Mailer.sendEmail(to, text, 'Your Login Verification Code', body);
    }

    /**
     *
     * @param to
     * @param text
     * @param body
     * @param subject
     */
    static async sendEmail(to: string, text: string, subject: string, body: string): Promise<boolean> {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });


        await transporter.sendMail({
            from: process.env.EMAIL_TO_USER,
            to,
            subject: subject,
            text: text,
            html: body,
        });

        return true;

    }


    /**
     *
     * @param template
     * @param replaces
     */
    static async getBody(template: string, replaces: Array<{ key: string, value: string }>): Promise<string> {
        let htmlTemplate = await FileSystem.readFileSync(template);
        replaces.forEach(repl => {
            htmlTemplate = htmlTemplate.replace(`{{${repl.key}}}`, repl.value);
        });
        return htmlTemplate;
    }
}