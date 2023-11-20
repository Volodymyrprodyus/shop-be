import { Client, ClientConfig } from 'pg';
import { Carts } from './carts';
import { CartItems } from './cartItems';
import { Users } from './users';
import { camelizeKeys } from '../utils';

export class DB {
  private static _client: Client;
  private static _carts: Carts;
  private static _cartItems: CartItems;
  private static _users: Users;

  static async connect(clientConfig: ClientConfig) {
    this._client = new Client(clientConfig);
    await this._client.connect();
  }

  static async query<T>(script: string, values: unknown[] = []): Promise<Array<T> | null> {
    const response = await this._client.query(script, values);
    return response?.rows ? camelizeKeys(response.rows) : null;
  }

  static get carts() {
    if (!this._carts) this._carts = new Carts(DB);
    return this._carts;
  }

  static get cartItems() {
    if (!this._cartItems) this._cartItems = new CartItems(DB);
    return this._cartItems;
  }

  static get users() {
    if (!this._users) this._users = new Users(DB);
    return this._users;
  }
}
