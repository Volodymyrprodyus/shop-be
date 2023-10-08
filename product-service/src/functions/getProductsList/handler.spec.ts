import { productsMock } from '../../mock-data/products';
import { getProductsList as handler } from './handler';

describe('getProductsList Handler', () => {
    it('returns statusCode 200', async () => {
        const response = await handler();
        expect(response.statusCode).toBe(200);
    });

    it('returns products in response', async () => {
        const response = await handler();

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify(productsMock));
    });
});
