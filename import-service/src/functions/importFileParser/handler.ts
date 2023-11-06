import { ReadableStream } from 'stream/web';
import { S3Event } from 'aws-lambda';
import { parseCSVFile } from '../../libs/parseCSVFile';
import { lambdaHandler } from '../../libs/lambda';
import { IProductWithStockList } from '../../../../services-models';
import { SQS_URL } from '../../constants';
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const importFileParser = async (event: S3Event) => {
    const region: string = event.Records[0]?.awsRegion;
    const bucketName: string = event.Records[0]?.s3.bucket.name;
    const fileKey: string = event.Records[0]?.s3.object.key;
    
    const webStream = (
        await getS3Object(region, bucketName, fileKey)
    ).Body?.transformToWebStream();
    const products = (await parseCSVFile(
        webStream as ReadableStream
    )) as IProductWithStockList;

    await moveS3Object(
        region,
        bucketName,
        fileKey,
        `parsed/${fileKey?.split('/')[1]}`
    );
    await deleteS3Object(region, bucketName, fileKey);

    for await (const product of products) {
        await sqsSendMessage(SQS_URL, JSON.stringify(product));
    }

    return { statusCode: 200, data: null };
};

const getS3Object = async (
    region: string,
    bucketName: string,
    fileKey: string
) => {
    const s3Client = new S3Client({ region });

    return await s3Client.send(
        new GetObjectCommand({ Bucket: bucketName, Key: fileKey })
    );
};

const moveS3Object = async (
    region: string,
    bucketName: string,
    fileKey: string,
    newPath: string
) => {
    const s3Client = new S3Client({ region });

    await s3Client.send(
        new CopyObjectCommand({
            Bucket: bucketName,
            CopySource: `${bucketName}/${fileKey}`,
            Key: newPath,
        })
    );
};

const deleteS3Object = async (
    region: string,
    bucketName: string,
    fileKey: string
) => {
    const s3Client = new S3Client({ region });

    await s3Client.send(
        new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey })
    );
};

const sqsClient = new SQSClient({});
const sqsSendMessage = async (sqsUrl: string, message: string, delay = 5) => {
    try {
        await sqsClient.send(
            new SendMessageCommand({
                QueueUrl: sqsUrl,
                MessageBody: message,
                DelaySeconds: delay,
            })
        );
    } catch (error) {
        console.log(`SQS sending message error: ${error}`);
    }
};

export const main = lambdaHandler(importFileParser);
