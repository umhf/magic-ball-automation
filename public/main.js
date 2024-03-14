document.getElementById('tradeForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    const tradeString = document.getElementById('tradeInput').value;

    // Send the tradeString to your server using fetch
    fetch('/api/trade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeString }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // You can do something with the response here
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
