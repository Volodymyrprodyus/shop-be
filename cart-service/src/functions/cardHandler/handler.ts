import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { bootstrap } from '../../bootstrap';

let server: Handler;

export const handler: Handler = async (
    event: unknown,
    context: Context,
    callback: Callback
) => {
    server =
        server ??
        (await bootstrap().then(async (app) => {
            app.enableCors({ origin: (_req, callback) => callback(null, true) });
            await app.init();

            return serverlessExpress({
                app: app.getHttpAdapter().getInstance(),
            });
        }));

    return server(event, context, callback);
};
