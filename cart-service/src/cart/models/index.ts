export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export type UpdatedCartItem = {
  cartId: string;
  productId: string;
  count: number;
};

export type UpdatedCard = {
  id: string;
  items: UpdatedCartItem[];
};
