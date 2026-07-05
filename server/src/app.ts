import express        from 'express';
import cors           from 'cors';
import { router }     from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://192.168.1.46:5173')
  .split(',').map(o => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use(notFound);
app.use(errorHandler);

export default app;
