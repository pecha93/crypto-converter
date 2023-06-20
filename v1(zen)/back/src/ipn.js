const express = require('express');
const app = express();
const crypto = require('crypto');

// Define your IPN secret
const ipnSecret = 'your-ipn-secret';

// IPN listener endpoint
app.post('/api/ipn', (req, res) => {
  const ipnData = req.body;
  const receivedHash = ipnData.hash;

  // Generate the expected hash based on the received IPN data
  const expectedHash = calculateIPNHash(ipnData, ipnSecret);

  // Compare the received hash with the expected hash
  if (receivedHash === expectedHash) {
    // IPN is valid, process the payment and update the order status
    // ...

    // Send the response to confirm the receipt of IPN
    res.json({ status: 'ok' });
  } else {
    // Invalid IPN, do not process the payment and log the error
    console.error('Invalid IPN received');

    // Send an error response
    res.status(400).json({ error: 'Invalid IPN' });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('IPN listener is running on port 3000');
});

// Function to calculate the hash for IPN verification
function calculateIPNHash(ipnData, ipnSecret) {
  // Extract the required IPN fields
  const {
    merchantTransactionId,
    currency,
    amount,
    status
  } = ipnData;

  // Concatenate the required fields with the IPN secret
  const dataToHash = `${merchantTransactionId}${currency}${amount}${status}${ipnSecret}`;

  // Calculate the SHA256 hash of the data
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

  return hash;
}