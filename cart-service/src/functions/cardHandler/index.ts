import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.handler`,
    events: [
        {
            http: {
                method: 'ANY',
                path: '/',
                cors: true,
            },
        },
        {
            http: {
                method: 'ANY',
                path: '{proxy+}',
                cors: true,
            },
        },
    ],
};
