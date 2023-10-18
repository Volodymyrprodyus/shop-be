import { getLambdaHandler, parseBody, validateSchema } from '../../libs/lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { ProductWithStockTable } from '../../dynamo-db';
import { createProductValidationSchema } from '../../validation-schemas';
import { ICreateProductRequest } from '../../models/product.model';

const _createProduct = async (event: APIGatewayProxyEvent) => {
    const { title, description, price, count } = parseBody(
        event.body || ''
    ) as ICreateProductRequest;

    validateSchema(400, createProductValidationSchema, {
        title,
        description,
        price,
        count,
    });
    const id = await ProductWithStockTable.create({
        title,
        description,
        price,
        count,
    });

    return id ? { statusCode: 200, data: { id } } : null;
};

export const main = getLambdaHandler(_createProduct);
