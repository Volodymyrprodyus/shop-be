import { middyfy, validateSchema } from '../../libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { productIdValidationSchema } from '../../validation-schemas';

export const _getProductById = async (
    event: APIGatewayProxyEvent
) => {
    let statusCode: number;
    const productId = event.pathParameters?.id || '';

    validateSchema(400, productIdValidationSchema, { productId });
    const product = await ProductWithStockTable.read(productId);

    statusCode = Boolean(product) ? 200 : 404;

    return {
         statusCode: statusCode,
         body: Boolean(product) ? JSON.stringify(product) : 'Item not found',
     };
};

export const main = middyfy(_getProductById);
