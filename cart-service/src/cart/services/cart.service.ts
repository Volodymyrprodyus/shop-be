import { Injectable } from '@nestjs/common';
import { UpdatedCard } from '../models';
import { DB, TCartStatus } from '../../db';

@Injectable()
export class CartService {
  async findByUserId(userId: string): Promise<UpdatedCard | null> {
    const cart = await DB.carts.findByUserId(userId, 'OPEN');

    if (cart) {
      const items = await DB.cartItems.findByCartId(cart.id);

      return { ...cart, items };
    }

    return null;
  }

  async createByUserId(userId: string) {
    return await DB.carts.create(userId);
  }

  async findOrCreateByUserId(userId: string): Promise<UpdatedCard> {
    let cart = await DB.carts.findByUserId(userId, 'OPEN');
    let items = [];

    if (cart) {
      items = (await DB.cartItems.findByCartId(cart.id)) || [];
    } else {
      cart = await this.createByUserId(userId);
    }

    return { id: cart.id, items };
  }

  async updateByUserId(userId: string, { items }: UpdatedCard): Promise<UpdatedCard> {
    const cart = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      ...cart,
      items: [...items],
    };

    await DB.cartItems.delete(cart.id);

    if (items.length) {
      await DB.cartItems.createMany(cart.id, items);
    }

    return { ...updatedCart };
  }

  async removeByUserId(userId) {
    const cart = await DB.carts.findByUserId(userId, 'OPEN');
    await DB.cartItems.delete(cart.id);
    await DB.carts.deleteByUserId(userId, 'OPEN');
  }

  async updateStatusById(cartId: string, status: TCartStatus) {
    return DB.carts.updateStatusById(cartId, status);
  }
}
