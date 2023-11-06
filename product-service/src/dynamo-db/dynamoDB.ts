import {
  DynamoDBClient,
  TransactWriteItemsCommand,
  TransactGetItemsCommand,
  TransactGetItem,
  TransactWriteItem,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { camelizeKeys } from '../libs/camelize';

type ExpressionType = {
  UpdateExpression: string;
  ExpressionAttributeValues: Record<string, unknown>;
  ExpressionAttributeNames: Record<string, string>;
};
type ExpressionMarshallType = ExpressionType & { ExpressionAttributeValues: Record<string, AttributeValue> };

export class DynamoDB {
  private ddbDocClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  protected async queryItem(conditionExpression: string, expressionAttributeValues: Record<string, unknown>) {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: conditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ConsistentRead: true,
    });

    return await this.ddbDocClient.send(command);
  }

  protected async queryItems() {
    const command = new ScanCommand({
      TableName: this.tableName,
      ConsistentRead: true,
    });

    return await this.ddbDocClient.send(command);
  }

  protected async putItem<T extends object>(item: T) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });

    return await this.ddbDocClient.send(command);
  }

  protected async deleteItem<T extends object>(key: T) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: key,
    });

    return await this.ddbDocClient.send(command);
  }

  protected async updateItem(key: Record<string, string>, item: Record<string, unknown>) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: key,
      ...this.getExpression(item),
    });

    return await this.ddbDocClient.send(command);
  }

  protected async transactWrite(items: Array<TransactWriteItem>) {
    const transactionCommand = new TransactWriteItemsCommand({
      TransactItems: items,
      ReturnItemCollectionMetrics: 'NONE',
    });

    return await this.ddbDocClient.send(transactionCommand);
  }

  protected async transactGet(items: Array<TransactGetItem>) {
    const transactionCommand = new TransactGetItemsCommand({
      TransactItems: items,
      ReturnConsumedCapacity: 'NONE',
    });
    return await this.ddbDocClient.send(transactionCommand);
  }

  protected getExpression(item: Record<string, unknown>): ExpressionType;
  protected getExpression(item: Record<string, unknown>, marshallValues: boolean): ExpressionMarshallType;
  protected getExpression(item: Record<string, unknown>, marshallValues?: boolean) {
    const UpdateExpression: Array<string> = [];
    const ExpressionAttributeValues: Record<string, unknown | AttributeValue> = {};
    const ExpressionAttributeNames: Record<string, string> = {};

    Object.keys(item).forEach(key => {
      const placeholder = `:${key}`;
      const alias = `#${key}`;
      UpdateExpression.push(`${alias} = ${placeholder}`);
      ExpressionAttributeValues[placeholder] = marshallValues ? marshall(item[key]) : item[key];
      ExpressionAttributeNames[alias] = key;
    });

    return {
      UpdateExpression: `set ${UpdateExpression.join(', ')}`,
      ExpressionAttributeValues,
      ExpressionAttributeNames,
    };
  }

  protected camelizeResponse<T>(obj: T): T {
    return camelizeKeys(obj);
  }
}
