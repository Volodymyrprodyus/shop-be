import { ClientConfig } from 'pg';

declare class _DBConnection {
  static connect(clientConfig: ClientConfig): Promise<void>;
  static query<T>(script: string, values?: unknown[]): Promise<Array<T> | null>;
}

export type DBConnection = typeof _DBConnection;
