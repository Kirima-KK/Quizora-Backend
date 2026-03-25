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

const allowedOrigins = [
  'https://quizora-backend.vercel.app/',
  'https://quizora-seven.vercel.app/',
  /\.vercel\.app$/ // This regex allows all Vercel preview subdomains
];

// initialize DB
await connectToDatabase();

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      return allowed instanceof RegExp ? allowed.test(origin) : allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
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
