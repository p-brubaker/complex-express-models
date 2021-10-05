import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import speciesRoutes from './controllers/species.js';
import animalsRoutes from './controllers/animals.js';

const app = express();

app.use(express.json());
app.use('/api/species/', speciesRoutes);
app.use('/api/animals/', animalsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
