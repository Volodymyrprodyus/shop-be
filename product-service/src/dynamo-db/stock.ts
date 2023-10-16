import { randomUUID } from 'crypto';
import { DynamoDB } from './dynamoDB';
import { STOCK_TABLE } from '../constants';
import { IStock, IStockList } from 'src/models/stock.model';

class Stock extends DynamoDB {
  constructor() {
    super(STOCK_TABLE);
  }

  async create(data: Omit<IStock, 'productId'>) {
    const product_id: string = randomUUID();
    await this.putItem({ product_id, ...data });

    return product_id;
  }

  async read(): Promise<{ items: IStockList; count: number }>;
  async read(id: string): Promise<IStock | null>;
  async read(id?: string) {
    if (id) {
      const res = await this.queryItem('product_id = :id', { ':id': id });
      return this.camelizeResponse(res?.Items?.[0] || null);
    } else {
      const res = await this.queryItems();
      return this.camelizeResponse({ items: res.Items, count: res.Count });
    }
  }

  async update(id: string, data: Partial<Omit<IStock, 'productId'>>) {
    await this.updateItem({ product_id: id }, data);
    return true;
  }

  async delete(id: string) {
    await this.deleteItem({ product_id: id });
  }
}

export default new Stock();
