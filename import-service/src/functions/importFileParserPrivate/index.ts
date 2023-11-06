import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                path: '/private/import',
                method: 'GET',
                // cors: [
                //     {
                //         enabled: true,
                //     },
                //     {
                //         origin: '*',
                //     },
                //     {
                //         headers: 'Content-Type,Authorization',
                //     },
                //     {
                //         methods: 'GET',
                //     },
                // ],
                request: {
                    parameters: {
                        // querystring: {
                        //     name: true,
                        // },
                    },
                },
                authorizer: {
                    name: 'tokenAuthorizer',
                    arn: {
                        "Fn::Join": [
                            "",
                            [
                                "arn:aws:lambda:",
                                {
                                    Ref: "AWS::Region",
                                },
                                ':',
                                {
                                    Ref: "AWS::AccountId",
                                },
                                ":function:authorization-service-dev-basicAuthorizer",
                            ],
                        ],
                    },
                    resultTtlInSeconds: 0,
                    identitySource: "method.request.header.Authorization",
                    type: "token",
                },
            },
        },
    ],
};
