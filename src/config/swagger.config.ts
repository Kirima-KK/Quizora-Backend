import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quizora API',
      version: '1.2.0',
      description: 'Backend API for the Quizora quiz platform',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sessionToken',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'role'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'USER'] },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            image: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'USER'] },
            correctAnswers: { type: 'number' },
            quizPassed: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Choice: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            choice: { type: 'string' },
          },
        },
        Question: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            question: { type: 'string' },
            choices: {
              type: 'array',
              items: { $ref: '#/components/schemas/Choice' },
            },
            answer: { type: 'number' },
          },
        },
        Quiz: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            passPoint: { type: 'number' },
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Question' },
            },
          },
        },
        PaginatedQuizzes: {
          type: 'object',
          properties: {
            quizes: {
              type: 'array',
              items: { $ref: '#/components/schemas/Quiz' },
            },
            totalPages: { type: 'number' },
          },
        },
        AnswerItem: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            choice: { type: 'number' },
            isCorrect: { type: 'boolean' },
          },
        },
        QuizHistoryRequest: {
          type: 'object',
          required: ['quizId', 'userId', 'answers', 'submittedDate', 'score', 'quizStatus'],
          properties: {
            quizId: { type: 'string' },
            userId: { type: 'string' },
            answers: {
              type: 'array',
              items: { $ref: '#/components/schemas/AnswerItem' },
            },
            submittedDate: { type: 'string', format: 'date-time' },
            score: { type: 'number' },
            quizStatus: { type: 'boolean' },
          },
        },
        QuizHistory: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            quizId: { type: 'string' },
            userId: { type: 'string' },
            answers: {
              type: 'array',
              items: { $ref: '#/components/schemas/AnswerItem' },
            },
            submittedDate: { type: 'string', format: 'date-time' },
            score: { type: 'number' },
            quizStatus: { type: 'boolean' },
          },
        },
        PaginatedQuizHistory: {
          type: 'object',
          properties: {
            quizHistory: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuizHistory' },
            },
            totalPages: { type: 'number' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
