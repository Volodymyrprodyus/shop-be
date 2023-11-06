import { IProduct, IProductList, IProductWithStockList } from "src/models/product.model";
import { IStockList } from "src/models/stock.model";

export const productsMock: IProduct[] = [
    {
        description: 'Short Product Description1',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        price: 2.4,
        title: 'BookOne',
    },
    {
        description: 'Short Product Description3',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
        price: 10,
        title: 'BookNew',
    },
    {
        description: 'Short Product Description2',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
        price: 23,
        title: 'BookTop',
    },
    {
        description: 'Short Product Description7',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        price: 15,
        title: 'BookHero',
    },
    {
        description: 'Short Product Description2',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
        price: 23,
        title: 'BookSmall',
    },
    {
        description: 'Short Product Description4',
        id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
        price: 15,
        title: 'BookWeather',
    },
    {
        description: 'Short Product Descriptio1',
        id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
        price: 23,
        title: 'BookNature',
    },
    {
        description: 'Short Product Description7',
        id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
        price: 15,
        title: 'BookWater',
    },
];

export const products: IProductList = [
    {
        description: 'Short Product Description1',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        price: 2.4,
        title: 'BookOne',
    },
    {
        description: 'Short Product Description3',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
        price: 10,
        title: 'BookNew',
    },
];

export const stockList: IStockList = [
    {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        count: 1,
    },
    {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
        count: 2,
    },
];

export const productsWithStock: IProductWithStockList = [
    {
        description: 'Short Product Description1',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        price: 2.4,
        title: 'BookOne',
        count: 1,
    },
    {
        description: 'Short Product Description3',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
        price: 10,
        title: 'BookNew',
        count: 2,
    },
];

