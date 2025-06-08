import express from 'express';
import "dotenv/config";
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './configs/db.js';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import { clerkMiddleware } from '@clerk/express';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import './configs/cloudinary.js';
import { stripeWebhookHandler } from './controllers/stripeWebhooks.js';

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// ⚠️ Stripe webhook route with RAW body parser MUST come before express.json()
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// JSON body parser for the rest of the app
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// Clerk webhook route
app.use('/api/clerk', clerkWebhooks);

// API routes
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

// Root route
app.get('/', (req, res) => {
    res.send('API is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
