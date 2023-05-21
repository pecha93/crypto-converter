const giftCardForm = document.getElementById('giftCardForm');

    giftCardForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const amountInput = document.getElementById('amount');

      const amount = parseFloat(amountInput.value);

      const response = await fetch('/gift-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      if (response.ok) {
              const result = await response.json();
      document.getElementById('result').innerHTML = `
        <p>Gift Card Number: ${result.data.referenceNo}</p>
        <p>Redemption Code: ${result.data.code}</p>
      `;

      } 
      else {
        console.log('Failed to create gift card');
        document.getElementById('result').innerHTML = '<p>Error creating Binance gift card</p>';

      }
    });