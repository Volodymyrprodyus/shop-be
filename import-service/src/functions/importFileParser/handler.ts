import { ReadableStream } from 'stream/web';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { parseCSVFile } from '../../libs/parseCSVFile';
import { lambdaHandler } from '../../libs/lambda';

const _importFileParser = async (event: S3Event) => {
  const region = event.Records[0]?.awsRegion;
  const bucketName = event.Records[0]?.s3.bucket.name;
  const fileKey = event.Records[0]?.s3.object.key;

  const client = new S3Client({ region: region });
  const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: fileKey });
  const webStream = (await client.send(getCommand)).Body?.transformToWebStream();
  const parseData = await parseCSVFile(webStream as ReadableStream);

  console.log('parsed data: ', parseData);

  const copyCommand = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${fileKey}`,
    Key: `parsed/${fileKey?.split('/')[1]}`,
  });

  const deleteCommand = new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey });

  await client.send(copyCommand);
  await client.send(deleteCommand);

  return { statusCode: 200, data: null };
};

export const main = lambdaHandler(_importFileParser);
