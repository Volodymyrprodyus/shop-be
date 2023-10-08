import { getByIdMockEvent } from '../../mock-data/events';
import { productsMock } from '../../mock-data/products';
import { getProductById as handler } from './handler';
import { Product } from '../../models/product.model';

describe('getProductById Handler', () => {
    it('returns statusCode 200', async () => {
        const response = await handler(getByIdMockEvent);
        expect(response.statusCode).toBe(200);
    });

    it('returns statusCode 404', async () => {
        const response = await handler({
            ...getByIdMockEvent,
            pathParameters: { productId: 'Book111' },
        });
        expect(response.statusCode).toBe(404);
    });

    it('returns product in response', async () => {
        const productId: string = 'BookTop';
        const product: Product = productsMock.find(
            (productItem: Product) => productItem.title === productId
        );
        const response = await handler(getByIdMockEvent);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(product));
    });
});
