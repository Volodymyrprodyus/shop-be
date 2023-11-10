import {
    type APIGatewayAuthorizerCallback,
    type APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';

const generatePolicy = (
    principalId: string,
    resource: string,
    effect: 'Allow' | 'Deny'
) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
    },
});

export const basicAuthorizer = (
    event: APIGatewayTokenAuthorizerEvent,
    _: unknown,
    callback: APIGatewayAuthorizerCallback
) => {
    console.log('EVENT: ', event);

    const { authorizationToken, methodArn, type } = event;

    if (
        type !== 'TOKEN' ||
        !authorizationToken ||
        !authorizationToken?.startsWith('Basic ')
    ) {
        callback('Unauthorized');
    }

    try {
        const encodedToken = authorizationToken.replace('Basic ', '');
        const [userName, password] = Buffer.from(encodedToken, 'base64')
            .toString('utf-8')
            .split(':');
        const effect =
            userName && password && process.env[userName] === password
                ? 'Allow'
                : 'Deny';

        callback(null, generatePolicy(encodedToken, methodArn, effect));
    } catch (error) {
        callback(`Unauthorized: ${(error as Error).message}`);
    }
};
