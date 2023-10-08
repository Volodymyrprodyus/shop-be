import { APIGatewayProxyResult } from 'aws-lambda';
import { productsMock } from '../../mock-data/products';
import { middyfy } from '@libs/lambda';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
    await Promise.resolve(1);

    return {
        statusCode: 200,
        body: JSON.stringify(productsMock),
    };
};

export const main = middyfy(getProductsList);
