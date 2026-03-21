import { Request, Response, NextFunction } from 'express';
import {JwtService} from "../app/JwtService";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authorize = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization token is missing or invalid format.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    const decodedPayload = JwtService.verifyToken(token);

    if (!decodedPayload) {
        res.status(403).json({ message: 'Token is invalid or has expired.' });
        return;
    }

    req.user = decodedPayload;
    next();
};