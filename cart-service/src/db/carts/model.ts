export type TCartStatus = 'OPEN' | 'ORDERED';

export interface ICart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: TCartStatus;
}
