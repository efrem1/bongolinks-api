import crypto from 'crypto';
import {FileSystem} from "./FileSystem";

export class DigitalSignature {


    public static generateKeys() {
        return crypto.generateKeyPairSync('ed25519', {
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'}
        });
    }

    /**
     *
     * @param text
     */
    public static async sign(text: string): Promise<string> {
        const privateKeyPem = await FileSystem.readFileSync('../../keys/private.pem');
        const signatureBuffer = crypto.sign(null, Buffer.from(text, 'utf8'), privateKeyPem);
        return signatureBuffer.toString('base64');
    }


    /**
     * 00
     * @param text
     * @param signatureBase64
     */
    public static async verify(text: string, signatureBase64: string): Promise<boolean> {
        try {
            const publicKeyPem = await FileSystem.readFileSync('../../keys/public.pem');
            const signatureBuffer = Buffer.from(signatureBase64, 'base64');
            return crypto.verify(null, Buffer.from(text, 'utf8'), publicKeyPem, signatureBuffer);
        } catch (error) {
            return false;
        }
    }

}