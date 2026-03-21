import createError from 'http-errors';
import express, {type Request, type Response} from 'express';
import path from 'path';
import cors from 'cors';
import logger from './middlewares/logging';

const cookieParser = require('cookie-parser');
import indexRouter from './routes/index';


import './config/modalsynchronization';


const app = express();

app.use(cors({
        origin: 'http://localhost:3005',
        credentials: true,
    }
));

app.use((req: Request, res: Response, next: any) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-v1', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err: any, req: Request, res: Response, next: any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
