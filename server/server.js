import express from 'express';
import "dotenv/config";
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './configs/db.js';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
// import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import './configs/cloudinary.js';
connectDB();
// connectCloudinary
const app = express();
app.use(cors());   //enable cross-origin resource sharing

// middleware
app.use(express.json());
app.use(clerkMiddleware());
// api to listen to cleark middlewares
app.use('/api/clerk',clerkWebhooks);

app.get('/', (req, res) => {
    res.send('api is running!');
});
// api routes
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings',bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});