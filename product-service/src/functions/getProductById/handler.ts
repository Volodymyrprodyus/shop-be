import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { productsMock } from '../../mock-data/products';
import { Product } from '../../models/product.model';


export const getProductById = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let statusCode: number;
    await Promise.resolve(1);

    const title = event.pathParameters.productId;
    const product: Product = productsMock.find(
        (productItem: Product) => productItem.title === title
    );
    statusCode = Boolean(product) ? 200 : 404;

    return {
        statusCode: statusCode,
        body: Boolean(product) ? JSON.stringify(product) : 'Item not found',
    };
};

export const main = middyfy(getProductById);
