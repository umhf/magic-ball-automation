document.getElementById('tradeForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission
    const token = document.getElementById('tokenInput').value;
    const button = e.target.querySelector('button[type="submit"]');
    button.disabled = true;
    setTimeout(() => button.disabled = false, 5000); // Enable the button after 5 seconds

    const tradeString = document.getElementById('tradeInput').value;

    // Send the tradeString to your server using fetch
    fetch('/api/trade', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tradeString }),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }
        })
        .then(data => {
            console.log('Success:', data);
            document.getElementById('responsePlaceholder').innerHTML = `<div id="responseWrapper"><pre><code>${JSON.stringify(data, null, 2)}</code></pre></div>`;
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('responsePlaceholder').innerHTML = `<div id="responseWrapper"><pre><code>Error: ${error.message}</code></pre></div>`;
        });
});
