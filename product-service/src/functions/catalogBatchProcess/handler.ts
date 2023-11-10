
import { SQSEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { sendEmailAction } from '../../libs/sns-email';
import { createProductValidationSchema } from '../../validation-schemas';
import { getBatchLambdaHandler, simpleValidateSchema } from '../../libs/lambda';

const catalogBatchProcess = async (event: SQSEvent) => {
  const validatedRecords = event.Records.map(({ body }) => JSON.parse(body)).map(productRecord => {
    const isValid = simpleValidateSchema(createProductValidationSchema, productRecord);

    return { isValid, data: productRecord };
  });

  const validRecords = validatedRecords.filter(({ isValid }) => isValid).map(({ data }) => data);
  const invalidRecords = validatedRecords.filter(({ isValid }) => !isValid).map(({ data }) => data);

  for await (const record of validRecords) {
    await ProductWithStockTable.create(record);
  }

  if (validRecords.length) {
    await sendEmailAction({
        ...generateMessageTemplate('success', validRecords),
    });
  }

  if (invalidRecords.length) {
    await sendEmailAction({
        ...generateMessageTemplate('error', invalidRecords),
    });
  }

  return { statusCode: 200, data: null };
};

const generateMessageTemplate = (
    status: 'error' | 'success',
    data: Array<Record<string, unknown>>
) => {
    return {
        status,
        subject: `Product create status ${status}!`,
        message:
            `The following products were ${
                status === 'success' ? '' : 'not'
            } created!\n\n` +
            `${data.map(
                (item, index) => `${index}. ${JSON.stringify(item)}\n`
            )}`,
    };
};

export const main = getBatchLambdaHandler(catalogBatchProcess);
