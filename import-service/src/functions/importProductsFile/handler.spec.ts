process.env.BUCKET_NAME = 's3BucketName';
process.env.REGION = 's3Region';

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
import { APIGatewayProxyEvent } from 'aws-lambda';
import { parseResponse } from '../../../../product-service/src/libs/lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { main as importProductsFile } from '../../functions/importProductsFile/handler';

const signedUrlMock = 'https://some-mocked-signed-url';
const s3ClientInstance = {};
const putObjectCommandInstance = {};
const BUCKET_NAME = 's3BucketName';
const REGION = 's3Region';

jest.mock('@aws-sdk/client-s3', () => {
    return {
        S3Client: jest.fn().mockImplementation(() => s3ClientInstance),
        PutObjectCommand: jest.fn().mockImplementation(() => putObjectCommandInstance),
    };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn().mockImplementation(() => Promise.resolve(signedUrlMock)),
}));

describe('importProductsFile Handler', () => {
    it('should return signed URL', async () => {
        const fileNameMock = 'some_file.csv';
        const event = { queryStringParameters: { name: fileNameMock } };
        const response = await importProductsFile(
            event as unknown as APIGatewayProxyEvent
        );

        expect(S3Client).toHaveBeenCalledWith({ region: REGION });
        expect(PutObjectCommand).toHaveBeenCalledWith({
            Bucket: BUCKET_NAME,
            Key: `uploaded/${fileNameMock}`,
        });
        expect(getSignedUrl).toHaveBeenCalledWith(
            s3ClientInstance,
            putObjectCommandInstance,
            { expiresIn: 120 }
        );
        expect(response).toEqual(parseResponse(200, signedUrlMock));
    });
});
