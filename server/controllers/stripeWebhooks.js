import stripe from 'stripe';
import Booking from '../models/Booking.js';

// api to handle Stripe webhooks
export const stripeWebhookHandler = async (req, res) => {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const stripeClient = new stripe(stripeSecret);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // handle the event
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const paymentId = paymentIntent.id;

        // Get the session associated with this payment intent
        const sessions = await stripeClient.checkout.sessions.list({ payment_intent: paymentId });
        const session = sessions.data[0];

        if (session && session.metadata && session.metadata.bookingId) {
    const bookingId = session.metadata.bookingId;
    console.log('Updating booking as paid:', bookingId);
    const updated = await Booking.findByIdAndUpdate(
        bookingId,
        {
            isPaid: true,
            paymentMethod: 'stripe',
        },
        { new: true }
    );
    console.log('Updated booking:', updated);
} else {
    console.log('No bookingId found in session metadata:', session);
}
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
};
export default stripeWebhookHandler;