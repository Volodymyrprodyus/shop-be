import type { AWS } from '@serverless/typescript';

import { importFileParser, importProductsFile, importProductsFilePrivate } from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
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
        iam: {
            role: 'ImportServiceRole',
        },
        environment: {
            BUCKET_NAME: 'shop-import-service-bucket',
            REGION: 'us-east-1',
            SQS_URL: {
                'Fn::Join': [
                    '',
                    [
                        'https://sqs.',
                        {
                            Ref: 'AWS::Region',
                        },
                        '.amazonaws.com/',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        '/${self:custom.SQSName}',
                    ],
                ],
            },
        },
    },
    // import the function via paths
    functions: {
        importProductsFile,
        importProductsFilePrivate,
        importFileParser,
    },
    resources: {
        Resources: {
            ImportServiceRole: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    RoleName: 'ImportServiceLambdaS3Access',
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
                    ],
                    Policies: [
                        {
                            PolicyName: 'ImportServiceAccessPolicy',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Effect: 'Allow',
                                        Action: [
                                            's3:PutObject',
                                            's3:PutObjectAcl',
                                            's3:GetObject',
                                            's3:DeleteObject',
                                        ],
                                        Resource: [
                                            'arn:aws:s3:::${self:custom.bucketName}/*',
                                        ],
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        },
    },
    package: { individually: true },
    custom: {
        bucketName: 'shop-import-service-bucket',
        SQSName: 'catalogItemsQueue',
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node18',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
