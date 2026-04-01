import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import serverConfig from './config/server.config.js';
import { connectToDatabase } from './db/index.js';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import quizRoutes from './routes/quiz.route.js';
import quizHistoryRoutes from './routes/quiz-history.route.js';

import ErrorHandler from './middleware/errors-handler.middleware.js';

const app = express()

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Check if the origin matches Vercel or Localhost
  const isVercel = origin && /^https:\/\/.*\.vercel\.app$/.test(origin);
  const isLocal = origin === 'http://localhost:3000';

  if (isVercel || isLocal) {
    // Set the headers
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  }

  // handle the Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

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

// Swagger definition
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Quizora API',
//       version: '1.0.0',
//       description: 'Quizora API documentation using Swagger',
//     },
//     servers: [
//       {
//         url: `http://localhost:${serverConfig.port}`,
//       },
//     ],
//     components: {
//       // securitySchemes: {
//       //   bearerAuth: {
//       //     type: 'http',
//       //     scheme: 'bearer',
//       //     bearerFormat: 'JWT',
//       //   },
//       // },
//     },
//   },
//   apis: ['./routes/*.ts'],
// };

// const swaggerDocs = swaggerJSDoc(swaggerOptions);
// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', (req, res, next) => {
  res.send("Hello Quizora!");
});

app.listen(serverConfig.port, () => {
  console.log(`Quizora Backend App: listening on port ${serverConfig.port}`);
});

export default app
