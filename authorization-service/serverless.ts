import type { AWS } from '@serverless/typescript';

import { basicAuthorizer } from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'authorization-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        profile: 'default',
        region: 'us-east-1',
        stage: 'dev',
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    // import the function via paths
    functions: { basicAuthorizer },
    package: { individually: true },
};

module.exports = serverlessConfiguration;