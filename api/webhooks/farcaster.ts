import axios from 'axios';
import openclawAgent from '../../services/openclawAgent';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const SIGNER_UUID = process.env.FARCASTER_SIGNER_UUID;
const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/cast';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate Neynar Webhook Secret (optional but recommended)
    // const secret = process.env.NEYNAR_WEBHOOK_SECRET;

    const { data } = req.body;

    if (!data || data.type !== 'cast') {
        return res.status(200).json({ received: true });
    }

    const cast = data.cast;
    if (!cast) return res.status(200).json({ received: true });

    const message = cast.text;
    const senderId = cast.author.fid.toString();
    const senderName = cast.author.username;

    console.log(`💬 Webhook: Farcaster mention from @${senderName}: ${message}`);

    try {
        // Strip mention from message
        const cleanMessage = message.replace(/@\w+/g, '').trim();

        // Get AI response using common agent logic
        const aiResponse = await openclawAgent.handleMessage(
            cleanMessage || "help",
            senderId,
            'farcaster',
            senderName
        );

        // Post reply back to Farcaster
        if (NEYNAR_API_KEY && SIGNER_UUID) {
            await axios.post(
                NEYNAR_API_URL,
                {
                    signer_uuid: SIGNER_UUID,
                    text: `@${senderName} ${aiResponse}`,
                    parent: cast.hash
                },
                {
                    headers: {
                        'api_key': NEYNAR_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(`✅ Webhook: Replied to @${senderName}`);
        }

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('❌ Farcaster Webhook Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
}
