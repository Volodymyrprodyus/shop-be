import { APIGatewayProxyResult } from 'aws-lambda';
import { ObjectSchema, ValidationError } from 'yup';

export const parseResponse = (
    statusCode: number,
    response: unknown
): APIGatewayProxyResult => ({
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    body: typeof response === 'string' ? response : JSON.stringify(response),
});

export const parseBody = (body = ''): Record<string, unknown> => {
    try {
        return JSON.parse(body);
    } catch (error) {
        throw {
            statusCode: 400,
            data: { message: 'Invalid JSON format' },
        };
    }
};

export const validateSchema = (
    code: number,
    schema: ObjectSchema<Record<string, unknown>>,
    obj: Record<string, unknown>
) => {
    try {
        schema.validateSync(obj, { abortEarly: false });
    } catch (error) {
        const { errors } = error as ValidationError;
        throw { statusCode: code, data: { message: errors.join(', ') } };
    }
};

export const lambdaHandler =
    (
        handler: (
            event: any
        ) => Promise<{ statusCode: number; data: unknown } | null>
    ) =>
    async (event: unknown) => {
        console.log('new event: ', JSON.stringify(event, null, 2));

        try {
            const res = await handler(event);

            return res
                ? parseResponse(res.statusCode, res.data)
                : parseResponse(404, { message: 'Not found' });
        } catch (error) {
            const {
                statusCode = 500,
                data = { message: 'Internal server error' },
            } = error as {
                statusCode: number;
                data: unknown;
            };

            console.log('error: ', error);
            return parseResponse(statusCode, data);
        }
    };
