"use strict";
const axios = require('axios');
// Binance API credentials
const apiKey = 'YOUR_API_KEY';
const apiSecret = 'YOUR_API_SECRET';
// Function to create a Binance gift card
async function createBinanceGiftCard(token, amount) {
    try {
        const recvWindow = 5000;
        const timestamp = Date.now();
        // Create the signature
        const signaturePayload = `amount=${amount}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
        const signature = crypto
            .createHmac('sha256', apiSecret)
            .update(signaturePayload)
            .digest('hex');
        // Create the request payload
        const payload = {
            token,
            amount,
            recvWindow,
            timestamp,
            signature
        };
        // Make the API request to create the gift card
        const response = await axios.post('https://api.binance.com/sapi/v1/giftcard/createCode', payload, {
            headers: {
                'X-MBX-APIKEY': apiKey
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Failed to create Binance gift card: ${error.message}`);
    }
}
;
module.exports.createBinanceGiftCard = createBinanceGiftCard;
//# sourceMappingURL=binanceGiftCard.js.map