import express from 'express';
import "dotenv/config";
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './configs/db.js';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import { clerkMiddleware } from '@clerk/express'

connectDB();
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});