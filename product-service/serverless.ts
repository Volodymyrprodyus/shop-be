import type { AWS } from '@serverless/typescript';

import { getProductsList } from './src/functions';
import { getProductById } from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        profile: 'default',
        region: 'us-east-1',
        stage: 'dev',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            PRODUCTS_TABLE_NAME: 'DynamoDBProducts',
            STOCKS_TABLE_NAME: 'DynamoDBStocks',
        },
        iam: {
            role: 'DynamoDBPolicy',
        },
    },
    // import the function via paths
    functions: { getProductsList, getProductById },
    resources: {
        Resources: {
            DynamoDBPolicy: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    RoleName: 'DynamoDBLambdasAccessRole',
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: {
                                    Service: ['lambda.amazonaws.com'],
                                },
                                Action: 'sts:AssumeRole',
                            },
                        ],
                    },
                    Policies: [
                        {
                            PolicyName: 'DynamoDBLambdasAccessPolicy',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            'dynamodb:*',
                                            'dynamodb:Scan',
                                            'dynamodb:GetItem',
                                            'dynamodb:PutItem',
                                            'dynamodb:UpdateItem',
                                            'dynamodb:DeleteItem',
                                        ],
                                        Resource:
                                            'arn:aws:dynamodb:${self:provider.region}:*:table/*',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            DynamoDBProducts: {
                Type: 'AWS::DynamoDB::Table',
                DeletionPolicy: 'Retain',
                Properties: {
                    TableName: 'products',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'S',
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH',
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
            DynamoDBStocks: {
                Type: 'AWS::DynamoDB::Table',
                DeletionPolicy: 'Retain',
                Properties: {
                    TableName: 'stocks',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'product_id',
                            AttributeType: 'S',
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'product_id',
                            KeyType: 'HASH',
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
        },
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;

// export const serverlessConfig = { ...serverlessConfiguration };

