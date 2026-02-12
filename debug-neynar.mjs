import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const SIGNER_UUID = process.env.FARCASTER_SIGNER_UUID;

console.log(`Checking signer with UUID: ${SIGNER_UUID}`);
console.log(`Using API Key: ${NEYNAR_API_KEY ? 'Set' : 'Not Set'}`);

async function checkSigner() {
    try {
        const response = await axios.get(`https://api.neynar.com/v2/farcaster/signer?signer_uuid=${SIGNER_UUID}`, {
            headers: {
                'api_key': NEYNAR_API_KEY
            }
        });
        console.log('Signer Info:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching signer:', error.response?.data || error.message);
    }
}

checkSigner();
