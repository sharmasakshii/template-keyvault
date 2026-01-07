import { BlobServiceClient } from "@azure/storage-blob";
import { dbConst } from "../connectionDb/dbconst";

export const blobConnection = async (request: any) => {
    try {
        const checkContainer: any = dbConst;

        const containerName = checkContainer[request?.company]?.bucketName

        const connectionString: any = process.env.AZURE_STORAGE_CONNECTION_STRING ?? ""
        const blobService: any = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobService.getContainerClient(containerName);

        return {
            containerName: containerName,
            containerClient: containerClient
        }
    }
    catch (err: any) {
        console.log(err, "Err")
        throw err
    }
}

export const uploadFileOnBlob = async (prop: any) => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);


        try {
            if (!prop.blobName) {
                throw new Error("blobName is required and must be a valid string.");
            }
            // Get a contaiblockBlobClientner client
            const containerClient = blobServiceClient.getContainerClient(prop?.containerName);
            // Ensure the container exists
            await containerClient.createIfNotExists({
                access: "container",
            });

            // Get a block blob client (suitable for uploading large data in chunks if needed)
            const blockBlobClient = containerClient.getBlockBlobClient(prop?.blobName);

            // Upload the buffer
            await blockBlobClient.uploadData(prop?.buffer, {
                blobHTTPHeaders: { blobContentType: "application/octet-stream" }, // Set content type
            });

            const blobUrl: any = blockBlobClient.url;


            return blobUrl;

        }
        catch (err) {
            console.log(err, "err")
            throw err
        }


        // Example usage

    }
    catch (err) {
        console.log(err, "err")
        throw err
    }
}