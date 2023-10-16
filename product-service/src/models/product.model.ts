import { IStock } from "./stock.model";

export interface IProduct {
    id: string;
    description: string;
    price: number;
    title: string;
}

export type IProductList = Array<IProduct>;
export type IProductWithStock = IProduct & Omit<IStock, 'productId'>;
export type IProductWithStockList = Array<IProductWithStock>;
