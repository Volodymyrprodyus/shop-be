import { IStock } from "./stock.model";

export interface IProduct {
    id: string;
    description: string;
    price: number;
    title: string;
}

export type IProductList = IProduct[];
export type IProductWithStock = IProduct & Omit<IStock, 'productId'>;
export type IProductWithStockList = Array<IProductWithStock>;

export type ICreateProductRequest = {
    title: string;
    description: string;
    price: number;
    count: number;
};
export type ICreateProductResponse = { id: string };