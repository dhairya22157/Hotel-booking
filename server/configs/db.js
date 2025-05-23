import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
export default connectDB;