import { Injectable } from '@nestjs/common';
import { User } from '../models';
import { DB } from '../../db';

@Injectable()
export class UsersService {
  async findOne(name: string): Promise<User> {
    return await DB.users.findByName(name);
  }

  async createOne({ name, password, email }: User): Promise<User> {
    return await DB.users.create({ name, password, email });
  }
}
