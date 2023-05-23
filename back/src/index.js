const express = require('express');
const session = require('express-session');
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

app.post('/gift-cards/', async (req, res) => {
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

pp.post('/signup', async (req, res) => {

  try {
    const { email, username, password } = req.body;

    const newUser = await signUpUser(email, username, password);

    req.session.userId = newUser.id;

    res.json(newUser);
  } catch (error) {
    console.error('Failed to sign up user:', error);
    res.status(500).json({ error: 'Failed to sign up user' });
  }
});

app.post('/signin', async (req, res) => {
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

app.get('/me', (req, res) => {
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


app.post('/logout', (req, res) => {
  // Destroy the session and clear the user ID
  req.session.destroy();

  res.json({ message: 'Logged out successfully' });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});