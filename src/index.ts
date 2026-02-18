import express from 'express';
import cors from 'cors';

import serverConfig from './config/server.config.js';
import { connectToDb } from './db/index.js';
// import routes from './routes';
const app = express()

// initialize DB
connectToDb();

app.use(express.json());
app.use(cors());

// Mount the routes
// app.use(routes);
app.get('/', (_req, res) => {
  res.send('Hello Express!')
})

app.listen(serverConfig.port, () => {
  console.log(`Quizora Backend App: listening on port ${serverConfig.port}`);
});

export default app
