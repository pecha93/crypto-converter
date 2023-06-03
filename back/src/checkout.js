const axios = require('axios');
const crypto = require('crypto');
const pool = require('./db');


async function checkout(item,currency, certificateAmount, firstName, lastName, email) {


    const rate = await getRate(item,currency); //async?
    var amount = certificateAmount*rate;

    transactionId = await saveOrderToDb(item, currency, amount, certificateAmount, firstName, lastName, email);


    const requestData = {
      terminalUuid: 'your-terminal-uuid',
      amount: amount,
      currency: currency,
      merchantTransactionId: transactionId,
      customer: {
        firstName: firstName,
        lastName: lastName,
        email: email
      },
     items: [
        {
          code: item,
          category: 'GiftCards',
          name: item,
          price: rate,
          quantity: certificateAmount,
          lineAmountTotal: amount
        }
      ],
      /*billingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        country: 'PL',
        street: 'streetName',
        city: 'cityName',
        countryState: 'stateName',
        province: 'provinceName',
        buildingNumber: '1',
        roomNumber: '11',
        postcode: '23-232',
        companyName: 'Company Name',
        phone: '+48555555555',
        taxId: '12345678'
      },
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        country: 'PL',
        street: 'streetName',
        city: 'cityName',
        countryState: 'stateName',
        province: 'provinceName',
        buildingNumber: '1',
        roomNumber: '11',
        postcode: '11-111',
        companyName: 'Company Name',
        phone: '+48555555555'
      },*/
      urlFailure: 'https://backtoshop/failure',
      urlSuccess: 'https://backtoshop/success',
    };
  
    // Generate the signature using the request data
    const signature = generateSignature(requestData);
  
    try {
      // Make a POST request to Zen.com API with the required form data
      const response = await axios.post('https://secure.zen.com/api/checkouts', {
        ...requestData,
        signature: signature
      });
  
      // Redirect the user to the Zen.com checkout page
      res.redirect(response.data.checkoutUrl);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while initiating the checkout');
    }
  };
  
  
  // Function to generate the signature
  function generateSignature(requestData) {
    // Replace this with your own logic to generate the signature
    // using your secret key and the required parameters
    const secretKey = 'your-secret-key';
  
    // Convert the JSON request data to a flat form
    const flatData = flattenObject(requestData);
  
    // Sort the parameters alphabetically
    const sortedKeys = Object.keys(flatData).sort();
  
    // Generate the signature string
    let signatureString = sortedKeys.map(key => `${key}=${flatData[key]}`).join('&');
    signatureString += secretKey;
  
    // Calculate the signature hash
    const algorithm = 'sha256';
    const signatureHash = crypto.createHash(algorithm).update(signatureString).digest('hex');
  
    // Combine the signature hash with the algorithm
    const signature = `${signatureHash};${algorithm}`;
  
    return signature;
  };
  
  // Function to flatten nested objects
  function flattenObject(obj, prefix = '') {
    const flattened = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          Object.assign(flattened, flattenObject(item, prefix + key + `[${index}].`));
        });
      } else {
        flattened[prefix + key] = obj[key];
      }
    }
    return flattened;
  };

  async function getRate(item)
  {

  const query = 'SELECT rate FROM product WHERE item = $1';
  const values = [item];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('item not found');
    }

    const reate = result.rows[0];

    return rate;
  } catch (error) {
    throw new Error('Failed to get rate', error);
  }

  }



  async function saveOrderToDb(item, certificateAmount, firstName, lastName, email, rate, amount) {
    try {
      const client = await pool.connect();
  
      // Insert order into the database
      const query = `
        INSERT INTO orders (item, currency, amount, certificateAmount, firstName, lastName, email)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `;
      const values = [item, rate.currency, amount, certificateAmount, firstName, lastName, email];
      const result = await client.query(query, values);
  
      // Retrieve the generated ID
      const id = result.rows[0].id;
  
      // Release the client back to the pool
      client.release();
  
      return id;
    } catch (error) {
      console.error('Error saving order to the database:', error);
      throw error;
    }
  }
  
  module.exports.checkout = checkout;