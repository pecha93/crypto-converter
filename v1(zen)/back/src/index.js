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
  var requestData = {
    terminalUuid: 'C864C476-2B0F-43A7-9258-A56EBE6A321E',
    amount: 1,
    currency: 'EUR',
    merchantTransactionId: 'test-6',
    customer: {
      firstName: 'Vladimir',
      lastName: 'Pedchneko',
      email: 'VladimirPedchenko1@gmail.com'
    },
   items: [
      {
        code: 'USDT',
        category: 'GiftCards',
        name: 'USDT',
        price: 1,
        quantity: 1,
        lineAmountTotal: 1
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
    urlFailure: 'https://gifta.store',
    urlSuccess: 'https://gifta.store',
    customIpnUrl: 'https://gifta.store'
  };

  // Generate the signature using the request data
  const signature = generateSignature(requestData);

  requestData = {
    terminalUuid: 'C864C476-2B0F-43A7-9258-A56EBE6A321E',
    amount: 1,
    currency: 'EUR',
    merchantTransactionId: 'test-6',
    customer: {
      firstName: 'Vladimir',
      lastName: 'Pedchneko',
      email: 'VladimirPedchenko1@gmail.com'
    },
   items: [
      {
        code: 'USDT',
        category: 'GiftCards',
        name: 'USDT',
        price: 1,
        quantity: 1,
        lineAmountTotal: 1
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
    urlFailure: 'https://gifta.store',
    urlSuccess: 'https://gifta.store',
    customIpnUrl: 'https://gifta.store',
    signature: signature
  };
/*
  try {
    // Make a POST request to Zen.com API with the required form data
    const response = await axios.post('https://secure.zen.com/api/checkouts', {
      ...requestData,
      signature: signature
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    // Redirect the user to the Zen.com checkout page
    res.redirect(response.data.checkoutUrl);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while initiating the checkout');
  }*/

  res.json(requestData);
});


/*/ Function to generate the signature
function generateSignature(requestData) {
  // Replace this with your own logic to generate the signature
  // using your secret key and the required parameters
  const secretKey = 'e22e01988d8e51334a04dedb80053af9';

  // Convert the JSON request data to a flat form
  const flatData = flattenObject(requestData);
  console.log('flatData = ',flatData);

  // Sort the parameters alphabetically
  const sortedKeys = Object.keys(flatData).sort();
  

  // Generate the signature string
  let signatureString = sortedKeys.map(key => `${key}=${flatData[key]}`).join('&');
  signatureString += secretKey;
  signatureString = signatureString.toLowerCase();
  console.log('signatureString = ',signatureString);

  //signatureString = 'amount=1000&billingaddress.buildingnumber=1&billingaddress.city=cityname&billingaddress.companyname=company name&billingaddress.country=pl&billingaddress.countrystate=statename&billingaddress.firstname=jan&billingaddress.id=baid1&billingaddress.lastname=kowalski&billingaddress.phone=+48555555555&billingaddress.postcode=23-232&billingaddress.province=provincename&billingaddress.roomnumber=11&billingaddress.street=streetname&billingaddress.taxid=12345678&currency=eur&customer.email=test@test.pl&customer.firstname=jan&customer.id=customerid328642&customer.lastname=kowalski&customipnurl=https://backtoshop/notiify&items[0].category=itemcategory1&items[0].code=itemcode1&items[0].lineamounttotal=400&items[0].name=itemname1&items[0].price=200&items[0].quantity=2&items[1].category=itemcategory2&items[1].code=itemcode2&items[1].lineamounttotal=600&items[1].name=itemname2&items[1].price=300&items[1].quantity=2&language=pl&merchanttransactionid=trasaction1&shippingaddress.buildingnumber=1&shippingaddress.city=cityname&shippingaddress.companyname=company name&shippingaddress.country=pl&shippingaddress.countrystate=statename&shippingaddress.firstname=jan&shippingaddress.id=sa1&shippingaddress.lastname=kowalski&shippingaddress.phone=+48555555555&shippingaddress.postcode=11-111&shippingaddress.province=provincename&shippingaddress.roomnumber=11&shippingaddress.street=streetname&terminaluuid=19b692d0-00b9-48f7-92ca-1509f055df2e&urlfailure=https://backtoshop/failure&urlredirect=https://backtoshop/redirect&urlsuccess=https://backtoshop/successc8c93c452d38acf3183q2n08fee60aa7'

  // Calculate the signature hash
  const algorithm = 'sha256';
  const signatureHash = crypto.createHash(algorithm).update(signatureString).digest('hex');

  // Combine the signature hash with the algorithm
  const signature = `${signatureHash};${algorithm}`;


  console.log('signature = ',signature);

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
  console.log(flattened)
  return flattened;
}*/

function generateSignature(requestData) {
  // Replace this with your own logic to generate the signature
  // using your secret key and the required parameters
  const secretKey = 'e22e01988d8e51334a04dedb80053af9';

  // Convert the JSON request data to a flat form
  const flatData = flattenObject(requestData);

  // Sort the parameters alphabetically
  const sortedKeys = Array.from(flatData.keys()).sort((a, b) => {
    const normalizedA = a.replace(/\[\d+\]/g, '');
    const normalizedB = b.replace(/\[\d+\]/g, '');
    return normalizedA.localeCompare(normalizedB);
  });

  // Generate the signature string
  let signatureString = sortedKeys.map(key => `${key}=${flatData.get(key)}`).join('&');
  signatureString += secretKey;
  signatureString = signatureString.toLowerCase();
  console.log('signatureString = ', signatureString);

  // Calculate the signature hash
  const algorithm = 'sha256';
  const signatureHash = crypto.createHash(algorithm).update(signatureString).digest('hex');

  // Combine the signature hash with the algorithm
  const signature = `${signatureHash};${algorithm}`;

  console.log('signature = ', signature);

  return signature;
}

// Function to flatten nested objects and sort the parameters alphabetically
function flattenObject(obj, prefix = '') {
  const flattened = new Map();
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nested = flattenObject(obj[key], prefix + key + '.');
      for (const [nestedKey, nestedValue] of nested) {
        flattened.set(nestedKey, nestedValue);
      }
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item, index) => {
        const arrayKey = `${prefix}${key}[${index}]`;
        const nested = flattenObject(item, arrayKey + '.');
        for (const [nestedKey, nestedValue] of nested) {
          flattened.set(nestedKey, nestedValue);
        }
      });
    } else {
      flattened.set(prefix + key, obj[key]);
    }
  }

  return new Map([...flattened.entries()].sort());
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});