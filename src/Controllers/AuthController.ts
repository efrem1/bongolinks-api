import {Request, Response} from "express";
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
            ApiResponse.error(res, "Something went wrong");
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

        const mightBeTaken = await usernameFilter.isTaken(username);

        if (mightBeTaken) {
            const actualUser = await db.User.findOne({where: {username}});
            if (actualUser) {
                return ApiResponse.ok(res, {message: 'Username already taken', username_taken: true});
            }
        }

        const _user = await db.User.findOne({where: {id: user.id}});
        if (!_user) {
            return ApiResponse.unauthorized(res);
        }

        _user.username = username;
        _user.save();
        await usernameFilter.add(username);
        return ApiResponse.ok(res, {message: 'Username added successfully.'});
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
}