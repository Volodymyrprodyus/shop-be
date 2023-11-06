import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductById, createProduct, catalogBatchProcess } from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: [
        'serverless-auto-swagger',
        'serverless-esbuild',
        'serverless-offline',
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
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
            PRODUCTS_TABLE_NAME: {
                Ref: 'products',
            },
            STOCKS_TABLE_NAME: {
                Ref: 'stocks',
            },
            REGION: 'us-east-1',
            SNS_TOPIC: {
                Ref: 'SNSCreateProductTopic',
            },
        },
        iam: {
            role: 'DynamoDBPolicy',
        },
    },
    functions: {
        getProductsList,
        getProductById,
        createProduct,
        catalogBatchProcess,
    },
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
                    ManagedPolicyArns: [
                        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                        'arn:aws:iam::aws:policy/AmazonSQSFullAccess',
                        'arn:aws:iam::aws:policy/AmazonSNSFullAccess',
                    ],
                    Policies: [
                        {
                            PolicyName: 'DynamoDBLambdasAccessPolicy',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
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
                    ],
                },
            },
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
            catalogItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'catalogItemsQueue',
                },
            },
            SNSCreateProductTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'createProductTopic',
                },
            },
            SNSCreateProductSuccessSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: 'create_products_sub@gmail.com',
                    TopicArn: {
                        Ref: 'SNSCreateProductTopic',
                    },
                    FilterPolicy: {
                        status: ['success'],
                    },
                },
            },
            SNSCreateProductErrorSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    Endpoint: 'create_products_sub@gmail.com',
                    TopicArn: {
                        Ref: 'SNSCreateProductTopic',
                    },
                    FilterPolicy: {
                        status: ['error'],
                    },
                },
            },
        },
    },
    package: { individually: true },
    custom: {
        autoswagger: {
            apiType: 'http',
            basePath: '/dev',
            typefiles: [
                './src/models/product.model.ts',
                './src/models/stock.model.ts',
            ],
        },
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
