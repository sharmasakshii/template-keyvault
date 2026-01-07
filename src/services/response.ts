import { encryptDataFunction } from "./encryptResponseFunction";

export function generateResponse(
    res: any,
    code: number,
    status: boolean | string | number,
    message: string,
    result = {},
    encrypt:any = true,
    headers: { [key: string]: string | number | boolean } = {},
) {
    // Encrypt or use raw data based on the `encrypt` flag
    const encryptData = encrypt ? encryptDataFunction(result) : result;

    res.status(code).json({
        status: status,
        message: message,
        data: encryptData,
    });

    Object.keys(headers).forEach((key) => {
        res.setHeader(key, headers[key]);
    });

    return res;
}
