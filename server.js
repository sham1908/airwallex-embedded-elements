const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto'); // Import crypto for HMAC verification


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


// Middleware to parse JSON bodies
app.use(express.json());


// Middleware to enable CORS
app.use(cors());


// Endpoint to create PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency, merchant_order_id, return_url, order } = req.body;
    console.log('Test')

    try {
        const response = await axios.post('https://api-demo.airwallex.com/api/v1/pa/payment_intents/create', {
            request_id: `${Date.now()}`, // Unique ID for the request
            amount: amount,
            currency: currency,
            merchant_order_id: merchant_order_id,
            return_url: return_url,
            order: order
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.AIRWALLEX_BEARER_TOKEN}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        res.status(500).json({ error: 'Failed to create PaymentIntent' });
    }
});


// Airwallex Webhook Secret
const webhookSecret = 'whsec_KOLlYDk3-uQx8pfFY2v7ko5XiCR8913D';


// Helper function to verify the webhook signature
function verifySignature(xTimestamp, xSignature, requestBody) {
    const valueToDigest = `${xTimestamp}${JSON.stringify(requestBody)}`;
    
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(valueToDigest)
        .digest('hex');

    return expectedSignature === xSignature;
}       

// Webhook endpoint to handle Airwallex events
app.post('/webhook', (req, res) => {
    const xTimestamp = req.headers['x-timestamp'];
    const xSignature = req.headers['x-signature'];

    // Step 1: Verify the signature
    if (!verifySignature(xTimestamp, xSignature, req.body)) {
        console.log('Invalid signature');
        return res.status(400).send('Invalid signature');
    }

    // Step 2: Ensure the event is within your allowed tolerance (e.g., 5 minutes)
    const currentTimestamp = Date.now();
    const receivedTimestamp = parseInt(xTimestamp, 10);
    const timeDifference = Math.abs(currentTimestamp - receivedTimestamp);

    // Tolerance for time difference (5 minutes in milliseconds)
    const timeTolerance = 5 * 60 * 1000;

    if (timeDifference > timeTolerance) {
        console.log('Webhook event is too old');
        return res.status(400).send('Event too old');
    }

    // Step 3: Process the webhook event
    const event = req.body;

    if (event.type === 'payment_created') {
        console.log('Payment created event received:', event.data);

        // You can add additional logic here, such as updating your database, sending notifications, etc.
    }

    console.log('Webhook event received:', req.body);

    // Step 4: Acknowledge the webhook
    res.status(200).send('Webhook received');
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});