const nodemailer = require('nodemailer');

// Create a transporter object with your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  host: 'your-smtp-host',
  port: 587, // Replace with your SMTP port
  secure: false, // Set to true if your SMTP server requires a secure connection
  auth: {
    user: 'your-email',
    pass: 'your-password'
  }
});

// Function to send an email
async function sendEmail(options) {
  try {
    const { from, to, subject, text, html } = options;

    // Define the email content
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      html: html
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to send Binance gift card email
async function sendGiftCardEmail(email, giftCardCode, giftCardId) {
  try {
    const from = 'your-email@example.com';
    const to = email;
    const subject = 'Binance Gift Card';
    const text = `Here is your Binance gift card code: ${giftCardCode}\nGift Card ID: ${giftCardId}`;
    const html = `
      <h1>Binance Gift Card</h1>
      <p>Thank you for your purchase!</p>
      <p>Here is your Binance gift card:</p>
      <ul>
        <li>Gift Card Code: ${giftCardCode}</li>
        <li>Gift Card ID: ${giftCardId}</li>
      </ul>
      <p>Enjoy your gift card!</p>
    `;

    // Send the email
    await sendEmail({ from, to, subject, text, html });
  } catch (error) {
    console.error('Error sending gift card email:', error);
  }
}

module.exports = { sendEmail, sendGiftCardEmail };