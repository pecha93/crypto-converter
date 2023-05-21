const axios = require('axios');
const crypto = require('crypto');
const { Spot } = require('@binance/connector')


// Binance API credentials
const apiKey = 'your';
const apiSecret = 'mom';
const client = new Spot(apiKey, apiSecret);


async function createBinanceGiftCard(amount) {
 /* var responseData

  client.giftCardCreateCode('USDT', amount).then(response => {
    client.logger.log(response.data); 
    responseData= response;
  })
  .catch(error => client.logger.error(error))

  return responseData; }*/
  
  try{
    console.log('test1');

    const response= await client.giftCardCreateCode('USDT', amount);
    console.log('test2');

    console.log(response.data);
    return response.data;

}
  catch (error) {
    console.error(`Failed to create Binance gift card: ${error.message}`);
    throw new Error(`Failed to create Binance gift card: ${error.message}`);
  }

  
}

// Function to create a Binance gift card
/*async function createBinanceGiftCard(token, amount) {
  try {
    const recvWindow = 5000;
    const timestamp = Date.now();

    // Create the signature
    const signaturePayload = `token=${token}&amount=${amount}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
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
  } catch (error) {
    throw new Error(`Failed to create Binance gift card: ${error.message}`);
        console.error(`Failed to create Binance gift card: ${error.message}`);
  }
};*/




module.exports.createBinanceGiftCard = createBinanceGiftCard;