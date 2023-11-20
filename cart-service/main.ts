import helmet from 'helmet';
import { bootstrap } from './bootstrap';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;

bootstrap()
  .then(async app => {
    app.enableCors({ origin: (req, callback) => callback(null, true) });
    app.use(helmet());
    await app.listen(port);
  })
  .then(() => {
    console.log('App is running on %s port', port);
  });
