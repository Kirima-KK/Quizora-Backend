import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import serverConfig from './config/server.config.js';
import { connectToDatabase } from './db/index.js';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import quizRoutes from './routes/quiz.route.js';
import quizHistoryRoutes from './routes/quiz-history.route.js';

import ErrorHandler from './middleware/errors-handler.middleware.js';

const app = express()

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    const isAllowed = serverConfig.allowedOrigins.some((allowed) => {
      return allowed instanceof RegExp ? allowed.test(origin) : allowed === origin;
    });

    console.log(`CORS Check: Origin [${origin}] | Result: [${isAllowed}]`);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// initialize DB
await connectToDatabase();

app.use(express.json());
app.use(cookieParser());

// Mount the routes
app.use(authRoutes);
app.use(userRoutes);
app.use(quizRoutes);
app.use(quizHistoryRoutes);

// Error handler middleware
app.use(ErrorHandler);

app.use('/', (req, res, next) => {
  res.send("Hello Quizora!");
});

app.listen(serverConfig.port, () => {
  console.log(`Quizora Backend App: listening on port ${serverConfig.port}`);
});

export default app
