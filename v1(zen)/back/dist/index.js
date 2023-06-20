"use strict";
const express = require('express');
const { createBinanceGiftCard } = require('./binanceGiftCard.js');
const app = express();
const port = 3000;
app.use(express.json());
app.post('/gift-cards', async (req, res) => {
    try {
        const { token, amount } = req.body;
        // Call the function to create a Binance gift card
        const result = await createBinanceGiftCard(token, amount);
        res.json(result);
    }
    catch (error) {
        console.error('Failed to create Binance gift card:', error);
        res.status(500).json({ error: 'Failed to create Binance gift card' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map