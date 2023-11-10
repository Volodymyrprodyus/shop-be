
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
import { APIGatewayProxyEvent } from 'aws-lambda';
import { BUCKET_NAME, REGION } from '../../constants';
import { lambdaHandler } from '../../libs/lambda';

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  const { name = '' } = event.queryStringParameters || {};
  const fileName = decodeURIComponent(name);

  if (!/^[a-z0-9-_]+\.csv$/i.test(fileName)) {
    throw {
      statusCode: 400,
      data: { message: 'Invalid file name.' },
    };
  }

  const s3Client = new S3Client({ region: REGION });
  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `uploaded/${fileName}`,
  });

  const signedUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 120,
  });

  return {
    statusCode: 200,
    data: signedUrl,
  };
};

export const main = lambdaHandler(importProductsFile);
