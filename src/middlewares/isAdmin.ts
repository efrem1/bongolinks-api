import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authorize';

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};
