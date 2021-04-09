import bodyParser from 'body-parser'
// import debug from 'debug';
import express from 'express'
// import mongoose from 'mongoose'
import path from 'path'
import logger from 'morgan'
import {
  error404,
  errorHandler,
} from './handlers/error';
/*
import mongoDb, {
  connect,
} from './helpers/mongo';
*/

// Import routes
// import indexRoutes from './routes/index';
// import userRoutes from './routes/users';

const app =express();

const publicPath = path.join(__dirname, '..', 'public');

// View engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(publicPath));

//  Set database engine
// app.set('db', connect(process.env.MONGO_URI));
// mongoDb.on('error', (error: string) => debug(`${process.env.APP_NAME}:db:error`)(error));
// mongoDb.once('open', () => debug(`${process.env.APP_NAME}:db`)('MongoDB connected'));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type","application/json");
  next();
});

// Use routes
// app.use('/', indexRoutes);
// app.use('/user', userRoutes);

app.use(error404);
app.use(errorHandler(app.get('env')));

export default app;
