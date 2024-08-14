import express from'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from "./routes/userRoutes.js"
import courseRoutes from './routes/couseRoutes.js'
import generalRoutes from './routes/generalRoutes.js'
import errorMiddleware from './middleware/errorMiddleware.js';
import paymentRoutes from './routes/paymentRoutes.js'
import { config } from 'dotenv';

config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));


app.use(cookieParser());
app.use(morgan('dev'))

app.use('/ping',(req,res)=>{
    res.send('pong')
})

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/payments',paymentRoutes)
app.use('/api/v1/contact',generalRoutes)
app.all('*',(req,res)=>{
    res.status(404).send('OOPS! 404 page not found')
})

app.use(errorMiddleware);

export default app;