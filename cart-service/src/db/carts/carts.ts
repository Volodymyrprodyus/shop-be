import { ICart, TCartStatus } from './model';
import { DBConnection } from '../dbConnection';

export class Carts {
  private table = 'carts';

  constructor(private client: DBConnection) {}

  async findByUserId(userId: string, status?: TCartStatus) {
    const query = `select * from ${this.table} where user_id = $1${status ? ` AND status = $2` : ''} limit 1;`;

    const res = await this.client.query<ICart>(query, [userId, status].filter(Boolean));
    return res?.[0] ?? null;
  }

  async create(userId: string) {
    const query = `insert into ${this.table} (user_id, status) values ($1, $2) returning *;`;

    const res = await this.client.query<ICart>(query, [userId, 'OPEN']);
    return res?.[0] ?? null;
  }

  async updateStatusById(cartId: string, status: TCartStatus) {
    const query = `update ${this.table} set status = $1 where id = $2 returning *;`;

    const res = await this.client.query<ICart>(query, [status, cartId]);
    return Boolean(res?.length);
  }

  async deleteByUserId(userId: string, status?: TCartStatus) {
    const query = `delete from ${this.table} WHERE user_id = $1${status ? ` AND status = $2` : ''} RETURNING *;`;

    const res = await this.client.query<ICart>(query, [userId, status].filter(Boolean));
    return Boolean(res?.length);
  }
}
