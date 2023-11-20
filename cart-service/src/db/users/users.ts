import { IUser } from './model';
import { DBConnection } from '../dbConnection';

export class Users {
  private table = 'users';

  constructor(private client: DBConnection) {}

  async findByName(name: string) {
    const query = `select * from ${this.table} where name = $1 limit 1;`;

    const res = await this.client.query<IUser>(query, [name]);
    return res?.[0] ?? null;
  }

  async create(data: Pick<IUser, 'name' | 'password' | 'email'>) {
    const query = `insert into ${this.table} (name, password, email) values ($1, $2, $3) returning *;`;
    const { name, password, email } = data;

    const res = await this.client.query<IUser>(query, [name, password, email]);
    return res?.[0] ?? null;
  }

  async updateById(id: string, data: Pick<IUser, 'name' | 'password' | 'email'>) {
    const query = `update ${this.table} set name = $1, password = $2, email = $3 where id = $4 returning *;`;
    const { name, password, email } = data;

    const res = await this.client.query<IUser>(query, [name, password, email, id]);
    return Boolean(res?.length);
  }

  async deleteById(id: string) {
    const query = `delete from ${this.table} where id = $1 returning *;`;

    const res = await this.client.query<IUser>(query, [id]);
    return Boolean(res?.length);
  }
}
