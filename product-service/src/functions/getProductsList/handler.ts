import { middyfy } from '../../libs/lambda';
import { ProductTable, StockTable } from '../../dynamo-db';

export const _getProductsList = async () => {
    const [products, stocks] = await Promise.all([
        ProductTable.read(),
        StockTable.read(),
    ]);

    const mergedProductData = (products?.items || []).map((product) => ({
        ...product,
        count:
            stocks?.items?.find(({ productId }) => productId === product.id)
                ?.count || 0,
    }));

    return mergedProductData.length
        ? { statusCode: 200, body: JSON.stringify(mergedProductData) }
        : null;
};

export const main = middyfy(_getProductsList);