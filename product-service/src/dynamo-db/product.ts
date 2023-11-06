import { randomUUID } from 'crypto';
import { DynamoDB } from './dynamoDB';
import { PRODUCT_TABLE } from '../constants';
import { IProduct, IProductList } from 'src/models/product.model';

class Product extends DynamoDB {
  constructor() {
    super(PRODUCT_TABLE);
  }

  async create(data: Omit<IProduct, 'id'>) {
    const id: string = randomUUID();
    await this.putItem({ id, ...data });

    return id;
  }

  async read(): Promise<{ items: IProductList; count: number }>;
  async read(id: string): Promise<IProduct | null>;
  async read(id?: string) {
    if (id) {
      const res = await this.queryItem('id = :id', { ':id': id });
      return this.camelizeResponse(res?.Items?.[0] || null);
    } else {
      const res = await this.queryItems();
      return this.camelizeResponse({ items: res.Items, count: res.Count });
    }
  }

  async update(id: string, data: Partial<Omit<IProduct, 'id'>>) {
    await this.updateItem({ id }, data);
    return true;
  }

  async delete(id: string) {
    await this.deleteItem({ id });
  }
}

export default new Product();
