import { AzureKeyCredential } from "@azure/core-auth";
import { EmailClient, EmailAttachment } from "@azure/communication-email";
import dotenv from "dotenv";
dotenv.config();

export const azurEmailFunction = async (props: any, connection: any,  sender?: string) => {
    try {
        const waitTime: any = process.env.POLLER_WAIT_TIME
        const POLLER_WAIT_TIME: number = parseInt(waitTime);
        let senderAddress;
        const { ACS_ENDPOINT, ACS_CONNECTION_CREDENTIAL, SENDER_ADDRESS } = process.env;
        senderAddress = sender ?? SENDER_ADDRESS;
        if (!ACS_ENDPOINT || !ACS_CONNECTION_CREDENTIAL || !SENDER_ADDRESS) {
            throw new Error("One or more required environment variables are missing.");
        }

        const credential = new AzureKeyCredential(ACS_CONNECTION_CREDENTIAL);
        const client = new EmailClient(ACS_ENDPOINT, credential);

        const attachment: EmailAttachment | undefined = props?.fileName && props?.fileType && props?.fileBuffer
            ? {
                name: props.fileName,
                contentType: props.fileType,
                contentInBase64: props.fileBuffer.toString('base64'),
            }
            : undefined;
        let recipients: any = {
            to: props.to,
        }
        if (props?.cc?.length > 0) {
            recipients['cc'] = props.cc
        }
        const message: any = {
            senderAddress: senderAddress,
            content: {
                subject: props.subject,
                html: props.html,
            },
            recipients: recipients,
            ...(attachment && { attachments: [attachment] }),
        };
        const poller: any = await client.beginSend(message);

        if (!poller.getOperationState().isStarted) {
            throw new Error("Poller was not started.");
        }
        let timeElapsed = 0;
        while (!poller.isDone()) {
            poller.poll();
            await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
            timeElapsed += 10;
            if (timeElapsed > 18 * POLLER_WAIT_TIME) {
                throw new Error("Polling timed out.");
            }
        }

    }
    catch (error: any) {
        console.log(error, "error")
        throw error
    }
};

