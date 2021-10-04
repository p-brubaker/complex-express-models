import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import speciesRoutes from './controllers/species.js';
const app = express();

app.use(express.json());
app.use('/api/species/', speciesRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
