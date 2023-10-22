import { parseResponse } from '../../libs/lambda';
import { ProductTable, StockTable } from '../../dynamo-db';
import { products, productsWithStock, stockList } from '../../mock-data/products';
import { main as handler } from './handler';
import { IProduct } from 'src/models/product.model';
import { IStock } from 'src/models/stock.model';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('getProductsList Handler', () => {
    it('should return 404 status code if products are not found', async () => {
        jest.spyOn(ProductTable, 'read').mockResolvedValueOnce(null);
        jest.spyOn(StockTable, 'read').mockResolvedValueOnce(null);
        const response = await handler({} as APIGatewayProxyEvent);
        expect(response).toEqual(parseResponse(404, { message: 'Not found' }));
    });

    it('should return 200 status code with products in response', async () => {
        jest.spyOn(ProductTable, 'read').mockResolvedValueOnce({
            items: products,
            count: products.length,
        } as unknown as IProduct);
        jest.spyOn(StockTable, 'read').mockResolvedValueOnce({
            items: stockList,
            count: products.length,
        } as unknown as IStock);
        const response = await handler({} as APIGatewayProxyEvent);

        expect(response).toEqual(parseResponse(200, productsWithStock));
    });
});
