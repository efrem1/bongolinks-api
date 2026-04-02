import {Request, Response} from "express";
import { Op } from "sequelize";
import 'winston-daily-rotate-file';
import {TokenGenerator} from "../app/TokenGenerator";
import {Mailer} from "../app/mail/Mailer";
import {DigitalSignature} from "../app/DigitalSignature";
import db from '../models';
import {JwtService} from "../app/JwtService";
import {ApiResponse} from "../app/ApiResponse";
import {USER_RESOURCE_SHAPE, UserResource} from "../resources/UserResource";
import {AUTH_REQUEST} from "./UserController";
import {usernameFilter} from "../app/UsernameFilter";
import logger from "../middlewares/logging";
import { OAuth2Client } from 'google-auth-library';
import {WhatsAppService} from "../services/WhatsAppService";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface VALID_VERIFICATION_RESPONSE {
    jwtToken: string;
    user: USER_RESOURCE_SHAPE
}

interface LOGIN_RESPONSE {
    verification_token: string
}


export class AuthController {

    /**
     *
     * @param req
     * @param res
     */
    public static async login(req: Request, res: Response) {
        try {
            const {email} = req.body;
            if (!email || !email.trim()) {
                return ApiResponse.error(res, "Email or password is required")
            }
            const token = TokenGenerator.makeVerificationToken();
            const verificationToken = await DigitalSignature.sign(`${token}-${email}`);

            const [user, created] = await db.User.findOrCreate({
                where: {email},
                defaults: {
                    verificationToken
                }
            });

            if (!created) {
                user.verificationToken = verificationToken;
                await user.save();
            }
            await Mailer.sendVerificationEmail(email, token);
            return ApiResponse.ok<LOGIN_RESPONSE>(res, {verification_token: encodeURIComponent(verificationToken)});
        } catch (error) {
            logger.error(JSON.stringify(error));
            ApiResponse.error(res, "Something went wrong");
        }

    }


    /**
     *
     * @param req
     * @param res
     */
    public static async googleAuth(req: Request, res: Response) {
        try {
            const { idToken } = req.body;
            if (!idToken) {
                return ApiResponse.error(res, "idToken is required");
            }
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                return ApiResponse.error(res, "Invalid Google token");
            }

            const { email, sub: googleId, given_name, family_name, picture } = payload;

            let user = await db.User.findOne({ where: { email } });
            if (!user) {
                user = await db.User.create({
                    email,
                    googleId,
                    firstName: given_name || '',
                    lastName: family_name || '',
                    avatar: picture || null,
                    onBoarded: false
                });
            } else if (!user.googleId) {
                user.googleId = googleId;
                if (!user.avatar && picture) user.avatar = picture;
                await user.save();
            }

            const user_data = UserResource.item<any, UserResource>(user);
            const jwtToken = JwtService.generateToken(user_data, '2342h');
            return ApiResponse.ok<VALID_VERIFICATION_RESPONSE>(res, { jwtToken, user: user_data });

        } catch (error) {
            logger.error(JSON.stringify(error));
            ApiResponse.error(res, "Google Auth failed");
        }
    }


    /**
     *
     * @param req
     * @param res
     */
    public static async verifyEmail(req: Request, res: Response) {
        const {token, signature} = req.body;
        const verificationToken = decodeURIComponent(signature);
        const user = await db.User.findOne({
            where: {
                verificationToken
            }
        });

        if (!user) {
            return ApiResponse.unauthorized(res);
        }
        const valid = await DigitalSignature.verify(`${token}-${user.email}`, verificationToken);
        if (!valid) {
            return ApiResponse.unauthorized(res);
        }
        const user_data = UserResource.item<any, UserResource>(user);
        const jwtToken = JwtService.generateToken(user_data, '2342h');
        return ApiResponse.ok<VALID_VERIFICATION_RESPONSE>(res, {jwtToken: jwtToken, user: user_data});
    }

    /**
     *
     * @param req
     * @param res
     */
    public static async updateUsername(req: AUTH_REQUEST, res: Response) {
        const {username} = req.body;
        const user = req.user;
        if (!user) {
            return ApiResponse.unauthorized(res);
        }

        const existingUser = await db.User.findOne({
            where: {
                username,
                id: { [Op.ne]: user.id }
            }
        });

        if (existingUser) {
            return ApiResponse.error(res, 'Username already taken');
        }

        const _user = await db.User.findOne({where: {id: user.id}});
        if (!_user) {
            return ApiResponse.unauthorized(res);
        }

        _user.username = username;
        await _user.save();
        await usernameFilter.add(username);
        return ApiResponse.ok(res, {message: 'Username updated successfully.'});
    }

    /**
     *
     * @param req
     * @param res
     */
    public static async liveCheckUsername(req: AUTH_REQUEST, res: Response) {
        const {username} = req.body;
        const mightBeTaken = await usernameFilter.isTaken(username);
        if (mightBeTaken) {
            return ApiResponse.ok(res, {message: 'Username already taken', username_taken: true});
        }
        return ApiResponse.ok(res, {message: 'Username available', username_taken: false});
    }

    /**
     * Send OTP via WhatsApp
     */
    public static async whatsappSendOtp(req: Request, res: Response) {
        try {
            const {whatsappNumber} = req.body;
            if (!whatsappNumber) {
                return ApiResponse.error(res, "WhatsApp number is required");
            }

            // Generate a 6-digit OTP
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

            await db.VerificationCode.create({
                identifier: whatsappNumber,
                code,
                expiresAt
            });

            await WhatsAppService.sendOtp(whatsappNumber, code);

            return ApiResponse.ok(res, {message: 'OTP sent to WhatsApp'});
        } catch (error: any) {
            logger.error(error.toString());
            return ApiResponse.error(res, "Failed to send WhatsApp OTP");
        }
    }

    /**
     * Verify WhatsApp OTP and login/register
     */
    public static async whatsappVerifyOtp(req: Request, res: Response) {
        try {
            const {whatsappNumber, code} = req.body;
            if (!whatsappNumber || !code) {
                return ApiResponse.error(res, "Number and code are required");
            }

            const verification = await db.VerificationCode.findOne({
                where: {
                    identifier: whatsappNumber,
                    code,
                    expiresAt: { [Op.gt]: new Date() }
                },
                order: [['createdAt', 'DESC']]
            });

            if (!verification) {
                return ApiResponse.error(res, "Invalid or expired code");
            }

            // Code verified, find or create user
            let user = await db.User.findOne({ where: { whatsappNumber } });
            if (!user) {
                user = await db.User.create({
                    whatsappNumber,
                    onBoarded: false
                });
            }

            // Delete the code after use
            await verification.destroy();

            const user_data = UserResource.item<any, UserResource>(user);
            const jwtToken = JwtService.generateToken(user_data, '2342h');
            return ApiResponse.ok<VALID_VERIFICATION_RESPONSE>(res, { jwtToken, user: user_data });
        } catch (error: any) {
            logger.error(error.toString());
            return ApiResponse.error(res, "WhatsApp verification failed");
        }
    }
}
