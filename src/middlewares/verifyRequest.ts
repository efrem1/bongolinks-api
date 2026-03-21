const fs = require('fs');
const crypto = require('crypto');
import {Request,Response,NextFunction} from 'express';

const publicKey = fs.readFileSync('./public.pem', 'utf8');

exports.verifyRequest = function (req:Request, res:Response, next:NextFunction) {
    const signature = req.headers['x-signature'];
    const payload = JSON.stringify(req.body);

    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(payload);
    verifier.end();
    if (!verifier.verify(publicKey, signature, 'base64')) {
        throw new Error("Unauthorized");
    }
    next();
}