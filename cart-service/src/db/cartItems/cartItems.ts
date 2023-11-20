import { ICartItem } from './model';
import { DBConnection } from '../dbConnection';

export class CartItems {
  private table = 'cart_items';

  constructor(private client: DBConnection) {}

  async findByCartId(cartId: string) {
    const query = `select * from ${this.table} where cart_id = $1;`;

    return await this.client.query<ICartItem>(query, [cartId]);
  }

  async createMany(cartId: string, data: Array<Omit<ICartItem, 'cartId'>>) {
    const items = data
      .filter(({ productId, count }) => Boolean(productId && count))
      .map(({ productId, count }) => [cartId, productId, count]);

    const valueIndexes = items.map((item, i) => item.map((_, j) => `$${i * 3 + (j + 1)}`));
    const values = valueIndexes.map(item => item.join(', ')).join('), (');
    const query = `insert into ${this.table} (cart_id, product_id, count) values (${values}) returning *;`;

    return await this.client.query<ICartItem>(query, items.flat());
  }

  async delete(cartId: string, productId?: string) {
    const query = `delete from ${this.table} where cart_id = $1 ${productId ? `and product_id = $2` : ''} returning *;`;

    const res = await this.client.query<ICartItem>(query, [cartId, productId].filter(Boolean));
    return Boolean(res?.length);
  }
}
