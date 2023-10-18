import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductById, createProduct } from './src/functions';

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
            PRODUCTS_TABLE_NAME: 'products',
            STOCKS_TABLE_NAME: 'stocks',
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: [
                            'dynamodb:Query',
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
    },
    functions: { getProductsList, getProductById, createProduct },
    resources: {
        Resources: {
            products: {
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
            stocks: {
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
