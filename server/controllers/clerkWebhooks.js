import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try{
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        }
        await webhook.verify(JSON.stringify(req.body), headers);
        const {data,type} = req.body;
        console.log("Webhook data:", data);
        console.log("Webhook type:", type);
        // Handle the webhook event based on its type
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }
        // switch cases for different events
        switch (type) {
            case "user.created":
                // Create a new user in your database
                const newUser = new User(userData);
                await newUser.save();
                console.log("User created:", newUser);
                break;
            case "user.updated":
                // Update the user in your database
                await User.findByIdAndUpdate(data.id, userData, { new: true });
                console.log("User updated:", userData);
                break;
            case "user.deleted":
                // Delete the user from your database
                await User.findByIdAndDelete(data.id);
                console.log("User deleted:", data.id);
                break;
            default:
                console.log("Unhandled event type:", type);
                break;
        }
        res.json({success: true, message: "Webhook processed successfully"});
    
    }
    catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export default clerkWebhooks;