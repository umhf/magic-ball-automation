const axios = require('axios');
require('dotenv').config();
const moment = require('moment');

let sessionToken = null;
let sessionTokenExpiration = moment(); // Initialize to now, will be updated upon token creation

const API_LOGIN = process.env.API_LOGIN;
const API_PASSWORD = process.env.API_PASSWORD;
const API_BASE_URL = process.env.API_BASE_URL;

// Ensure required environment variables are set
if (!API_LOGIN || !API_PASSWORD || !API_BASE_URL) {
    console.error("Missing required environment variables for API authentication.");
    process.exit(1); // Exit the application if critical configuration is missing
}

/**
 * Create a new user session and save the session token.
 */
async function createSession() {
    try {
        console.log("Creating Session: ", `${API_BASE_URL}/sessions`);
        const response = await axios.post(`${API_BASE_URL}/sessions`, {
            login: API_LOGIN,
            password: API_PASSWORD,
            "remember-me": false,
            "remember-token": ""
        });
        sessionToken = response.data.data['session-token'];
        console.log("Received session token: ", sessionToken);
        // Reset and set the token expiration to 24 hours from now
        sessionTokenExpiration = moment().add(12, 'hours'); // Correctly refresh the expiration time
        console.log("Session expires at ", sessionTokenExpiration.format());
        return sessionToken;
    } catch (error) {
        console.error('Error creating session:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Check if the session token is valid and not expired.
 */
function isSessionTokenValid() {
    return sessionToken !== null && moment().isBefore(sessionTokenExpiration);
}

/**
 * Ensure a valid session token is available for use.
 */
async function ensureValidSessionToken() {
    if (!isSessionTokenValid()) {
        await createSession();
    }
    return sessionToken;
}

module.exports = {
    ensureValidSessionToken
};
