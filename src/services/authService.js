const axios = require('axios');
require('dotenv').config();
const moment = require('moment');

let sessionToken = null;
const sessionTokenExpiration = moment();

const API_LOGIN = process.env.API_LOGIN;
const API_PASSWORD = process.env.API_PASSWORD;
const API_BASE_URL = process.env.API_BASE_URL;

/**
 * Create a new user session and save the session token.
 */
async function createSession() {
    try {
        console.log("Creating Session: ", `${API_BASE_URL}/sessions`)
        const response = await axios.post(`${API_BASE_URL}/sessions`, {
            login: API_LOGIN,
            password: API_PASSWORD,
            "remember-me": false,
            "remember-token": ""
        });
        sessionToken = response.data.data['session-token'];
        console.log("Received session token: ", sessionToken)
        // Set the token expiration to 24 hours from now
        sessionTokenExpiration.add(12, 'hours');
        console.log("Session expires at ", sessionTokenExpiration)
        return sessionToken;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
}

/**
 * Check if the session token is valid and not expired.
 */
function isSessionTokenValid() {
    return sessionToken !== null && new Date() < sessionTokenExpiration;
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
