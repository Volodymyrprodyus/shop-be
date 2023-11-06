import { productsWithStock } from '../../mock-data/products';
import { main as getProductsById } from './handler';
import { IProductWithStock } from '../../models/product.model';
import { ProductWithStockTable } from '../../dynamo-db';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { parseResponse } from '../../libs/lambda';

describe('getProductById Handler', () => {
    it('returns statusCode 200', async () => {
        const productData = productsWithStock[0] as IProductWithStock;
        const event = { pathParameters: { id: productData?.id } };
        jest.spyOn(ProductWithStockTable, 'read').mockResolvedValueOnce(
            productData
        );
        const response = await getProductsById(
            event as unknown as APIGatewayProxyEvent
        );

        expect(response).toEqual(parseResponse(200, productData));
    })

    it('returns statusCode 400 if product is not found', async () => {
        const productId = 'notUUID';
        const event = { pathParameters: { id: productId } };
        const response = await getProductsById(
            event as unknown as APIGatewayProxyEvent
        );

        expect(response).toEqual(
            parseResponse(400, { message: 'productId must be a valid UUID' })
        );
    });

    it('returns product in response', async () => {
        const product = productsWithStock[0] as IProductWithStock;
        const event = { pathParameters: { id: product?.id } };
        jest.spyOn(ProductWithStockTable, 'read').mockResolvedValueOnce(
            product
        );
        const response = await getProductsById(
            event as unknown as APIGatewayProxyEvent
        );

        expect(response).toEqual(parseResponse(200, product));
    });
})
