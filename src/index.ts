import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import serverConfig from './config/server.config.js';
import { connectToDatabase } from './db/index.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

const app = express()

// initialize DB
connectToDatabase();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Mount the routes
app.use(userRoutes);
app.use(authRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
});

app.get('/', (_req, res) => {
  res.send('Hello Express!')
})

app.listen(serverConfig.port, () => {
  console.log(`Quizora Backend App: listening on port ${serverConfig.port}`);
});

export default app
