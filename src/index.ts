import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import serverConfig from './config/server.config.js';
import { connectToDatabase } from './db/index.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import ErrorHandler from './middleware/unhandled-errors-middleware.js';

const app = express()

// initialize DB
connectToDatabase();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Mount the routes
app.use(userRoutes);
app.use(authRoutes);

// Error handler middleware
app.use(ErrorHandler);

app.get('/', (_req, res) => {
  res.send('Hello Express!')
})

app.listen(serverConfig.port, () => {
  console.log(`Quizora Backend App: listening on port ${serverConfig.port}`);
});

export default app
