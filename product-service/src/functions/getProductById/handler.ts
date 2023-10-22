import { getLambdaHandler, validateSchema } from '../../libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { productIdValidationSchema } from '../../validation-schemas';

export const _getProductById = async (
    event: APIGatewayProxyEvent
) => {
    const productId = event.pathParameters?.id || '';

    validateSchema(400, productIdValidationSchema, { productId });
    const product = await ProductWithStockTable.read(productId);

    return product ? { statusCode: 200, data: product } : null;;
};

export const main = getLambdaHandler(_getProductById);
