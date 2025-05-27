import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        // Use req.rawBody if available, else fallback (not recommended)
        const payload = req.rawBody ? req.rawBody : JSON.stringify(req.body);
        await webhook.verify(payload, headers);

        const { data, type } = req.body;
        console.log("Webhook data:", data);
        console.log("Webhook type:", type);

        switch (type) {
            case "user.created": {
                const username = [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || data.username || data.email_addresses[0].email_address;
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username,
                    image: data.image_url,
                };
                const newUser = new User(userData);
                await newUser.save();
                console.log("User created:", newUser);
                break;
            }
            case "user.updated": {
                const username = [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || data.username || data.email_addresses[0].email_address;
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username,
                    image: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
                console.log("User updated:", userData);
                break;
            }
            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                console.log("User deleted:", data.id);
                break;
            default:
                console.log("Unhandled event type:", type);
                break;
        }
        res.json({ success: true, message: "Webhook processed successfully" });

    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default clerkWebhooks;