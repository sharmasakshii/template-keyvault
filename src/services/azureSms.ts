import { AzureKeyCredential } from "@azure/core-auth";
import { SmsClient } from "@azure/communication-sms";

export const azureSmsFunction = async (props: any) => {
    try {
        const endpoint = process.env.ACS_ENDPOINT ?? "";
        const connectionCredential = process.env.ACS_CONNECTION_CREDENTIAL ?? ""

        const acsNumber = process.env.ACS_NUMBER ?? ""
      
        if (!endpoint || !connectionCredential) {
            throw new Error("Connection key missing")
        }

        const credential = new AzureKeyCredential(connectionCredential);

        const client = new SmsClient(endpoint, credential);
        const sendResults = await client.send(
            {
                from: acsNumber,
                to: props.phone_number,
                message: props.message
            },
            {
                enableDeliveryReport: true,
                tag: "marketing"
            }
        );

        for (const sendResult of sendResults) {

            if (sendResult.successful) {
                return true;
            } else {
                return false;
            }
        }
    }
    catch (error) {
        console.log(error, "err")
        throw error
    }
};