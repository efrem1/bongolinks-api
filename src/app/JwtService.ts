import jwt, {SignOptions} from 'jsonwebtoken';
import type {StringValue} from "ms";

export class JwtService {

    private static readonly SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key-change-me';

    /**
     *
     * @param payload
     * @param expiresIn
     */
    public static generateToken(payload: object, expiresIn: StringValue | number = '1h'): string {
        const signOptions: SignOptions = {
            expiresIn,
        };
        return jwt.sign(payload, this.SECRET_KEY, signOptions);
    }


    /**
     *
     * @param token
     */
    public static verifyToken(token: string): any | null {
        try {
            return jwt.verify(token, this.SECRET_KEY);
        } catch (error) {
            return null;
        }
    }
}