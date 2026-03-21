import crypto from "crypto";

export class TokenGenerator {

    /**
     *
     * @param length
     */
    public static makeVerificationToken(length = 6): string {
        const max = Math.pow(10, length);
        const randomNum = crypto.randomInt(0, max);
        return randomNum.toString().padStart(length, '0');
    }
}