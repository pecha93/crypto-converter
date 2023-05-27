const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');


const { createBinanceGiftCard } = require('./binanceGiftCard.js');
const { signUpUser, signInUser } = require('./users');


const app = express();
const port = 3000;

app.use(express.json());

app.use(
  session({
    secret: '123456',
    resave: false,
    saveUninitialized: false,
  })
);

app.post('/app/gift-cards/', async (req, res) => {
  try {
    console.error('try');
    const { amount } = req.body;

    // Call the function to create a Binance gift card
    const result = await createBinanceGiftCard(amount);

    res.json(result);
  } catch (error) {
    console.error('Failed to create Binance gift card:', error);
    res.status(500).json({ error: 'Failed to create Binance gift card'});
  }
});

app.post('/app/signup', async (req, res) => {

  try {
    const { email, username, password, apikey, apisecret } = req.body;

    const newUser = await signUpUser(email, username, password, apikey, apisecret);

    req.session.userId = newUser.id;

    res.json(newUser);
  } catch (error) {
    console.error('Failed to sign up user:', error);
    res.status(500).json({ error: 'Failed to sign up user' });
  }
});

app.post('/app/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await signInUser(email, password);
   
    if (user) {
      // Set the user ID in the session
      req.session.userId = user.id;

      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
    
  } catch (error) {
    console.error('Failed to sign in:', error);
    res.status(401).json({ error: 'Failed to sign in' });
  }
});

app.get('/app/me', (req, res) => {
  // Check if the user is logged in
  if (req.session.userId) {
    // Fetch the user from the database using the user ID stored in the session
    const user = getUserById(req.session.userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


app.post('/app/logout', (req, res) => {
  // Destroy the session and clear the user ID
  req.session.destroy();

  res.json({ message: 'Logged out successfully' });
});



// Route to initiate the Zen.com checkout
app.post('/app/checkout', async (req, res) => {
  const requestData = {
    terminalUuid: 'your-terminal-uuid',
    amount: req.body.amount,
    currency: 'EUR',
    merchantTransactionId: 'your-transaction-id',
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
   items: [
      {
        code: 'itemCode1',
        category: 'itemCategory1',
        name: 'itemName1',
        price: 200,
        quantity: 2,
        lineAmountTotal: 400
      },
      {
        code: 'itemCode2',
        category: 'itemCategory2',
        name: 'itemName2',
        price: 300,
        quantity: 2,
        lineAmountTotal: 600
      }
    ],
    billingAddress: {
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
    },
    urlFailure: 'https://backtoshop/failure',
    urlRedirect: 'https://backtoshop/redirect',
    urlSuccess: 'https://backtoshop/success',
    customIpnUrl: 'https://backtoshop/notiify'
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
});


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
}

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
}




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});