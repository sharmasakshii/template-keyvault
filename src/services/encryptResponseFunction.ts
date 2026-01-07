require("dotenv").config();
import crypto from "crypto-js";
const environment = process.env.ENV;
let secret_key: string = process.env.ENCRYPTION_KEY ?? "";

export const encryptDataFunction = (data: { status?: boolean; message?: any; data?: any[]; }) => {
    if (environment === 'LOCALHOST') {
        return data;
    } else {
        return crypto.AES.encrypt(JSON.stringify(data), secret_key).toString();
    }
}

export const decryptDataFunction = (data: any) => {
    try {
        if (environment === 'LOCALHOST') {
            return data;
        }
        else {
            let bytes = crypto.AES.decrypt(data, secret_key);
            return JSON.parse(bytes.toString(crypto.enc.Utf8));
        }
    } catch (error) {
        console.error('Error decrypting data:', error);
        throw error

    }
}


export const decryptPayloadUse = (req: any, res: any, next: any) => {
    try {
        const enabled = (process.env.ENCRYPTION_MIDDLEWARE_ENABLED) || "false"
        if (enabled === "false") {
            return next();
        }

        const encryptedPayload = req.body?.payload || req.query?.payload;

        let source: "body" | "query" | null = "body";

        if (req.body?.payload) source = "body";

        else if (req.query?.payload) source = "query";

        if (!encryptedPayload) {
            return res.status(400).json({
                message: "Encrypted payload is required",
            });
        }

        const decryptedPayload = decryptDataFunction(encryptedPayload);

        console.log(decryptedPayload, "decryptedPayload");
        Object.assign(req[source], decryptedPayload);

        next();
    } catch (error) {
        return res.status(400).json({
            message: "Invalid encrypted payload",
        });
    }
};


