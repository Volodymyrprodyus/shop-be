import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';

const csv = require('csv-parser');


export const parseCSVFile = (stream: ReadableStream) => {
    const _stream = Readable.fromWeb(stream);

    return new Promise((resolve) => {
        const results: Array<any> = [];

        _stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results));
    });
};
