/**
 * Farcaster Bot Integration for OpenQuest
 * Uses Neynar API to post casts
 */

import axios from 'axios';
import type { Quest } from '../types';
import openclawAgent from './openclawAgent';

// Neynar API configuration
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const SIGNER_UUID = process.env.FARCASTER_SIGNER_UUID;
const ENABLE_FARCASTER = process.env.ENABLE_FARCASTER === 'true';

const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/cast';
const NEYNAR_NOTIFICATIONS_URL = 'https://api.neynar.com/v2/farcaster/notifications';

// Track processed notification IDs
const processedNotifications = new Set<string>();

/**
 * Post a cast or reply to Farcaster via Neynar
 */
async function postCast(text: string, embeds: any[] = [], replyTo?: string): Promise<boolean> {
    if (!ENABLE_FARCASTER || !NEYNAR_API_KEY || !SIGNER_UUID) {
        return false;
    }

    try {
        const payload: any = {
            signer_uuid: SIGNER_UUID,
            text: text,
            embeds: embeds
        };

        if (replyTo) {
            payload.parent = replyTo;
        }

        const response = await axios.post(
            NEYNAR_API_URL,
            payload,
            {
                headers: {
                    'api_key': NEYNAR_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200 || response.status === 201) {
            console.log(replyTo ? '✅ Reply posted to Farcaster' : '✅ Cast posted to Farcaster');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error posting to Farcaster:', error);
        return false;
    }
}

/**
 * Start listening for Farcaster mentions (polling mode)
 */
export async function startMentionListener() {
    if (!ENABLE_FARCASTER || !NEYNAR_API_KEY || !SIGNER_UUID) {
        return;
    }

    console.log('🟣 Initializing Farcaster mention listener...');

    try {
        // First, get the FID associated with this signer
        const signerResponse = await axios.get(`https://api.neynar.com/v2/farcaster/signer?signer_uuid=${SIGNER_UUID}`, {
            headers: {
                'api_key': NEYNAR_API_KEY
            }
        });

        const fid = signerResponse.data.fid;
        if (!fid) {
            console.error('❌ Could not find FID for the provided SIGNER_UUID. Make sure the signer is approved.');
            return;
        }

        console.log(`✅ Farcaster Bot FID identified: ${fid}`);
        console.log('🟣 Starting Farcaster mention listener (Polling Mode enabled with Paid Tier)...');

        // Poll every 30 seconds
        setInterval(async () => {
            try {
                const response = await axios.get(NEYNAR_NOTIFICATIONS_URL, {
                    params: {
                        fid: fid,
                        type: 'mentions'
                    },
                    headers: {
                        'api_key': NEYNAR_API_KEY
                    }
                });

                const notifications = response.data.notifications || [];

                for (const notification of notifications) {
                    const cast = notification.cast;
                    if (!cast || processedNotifications.has(cast.hash)) continue;

                    processedNotifications.add(cast.hash);

                    const message = cast.text;
                    const senderId = cast.author.fid.toString();
                    const senderName = cast.author.username;

                    console.log(`💬 Farcaster mention from @${senderName}: ${message}`);

                    // Strip mention from message
                    const cleanMessage = message.replace(/@\w+/g, '').trim();

                    // Get AI response using common agent logic
                    const aiResponse = await openclawAgent.handleMessage(
                        cleanMessage || "help",
                        senderId,
                        'farcaster',
                        senderName
                    );

                    // Post reply
                    await postCast(`@${senderName} ${aiResponse}`, [], cast.hash);
                }
            } catch (error: any) {
                if (error.response?.status === 402) {
                    console.error('⚠️ Farcaster Polling Error: 402 Payment Required. (Your Neynar tier may not support notifications polling, or the upgrade is still processing.)');
                } else if (error.response?.status === 400) {
                    console.error('❌ Farcaster Polling Error: 400 Bad Request. Parameters might be incorrect.');
                } else {
                    console.error('❌ Error polling Farcaster mentions:', error.message);
                }
            }
        }, 30000);
    } catch (error: any) {
        console.error('❌ Failed to initialize Farcaster bot:', error.message);
    }
}

/**
 * Announce a new quest on Farcaster
 */
export async function announceNewQuest(quest: Quest): Promise<void> {
    const text = `🎯 NEW QUEST LIVE\n\n${quest.title}\n\n${quest.description}\n\n📊 Difficulty: ${quest.difficulty}\n🏷️ Category: ${quest.category}\n🎁 Reward: ${quest.rewardAmount || quest.rewardType}\n\nJoin & earn on Base! 🚀\n#Base #OpenQuest #Onchain`;

    await postCast(text);
}

/**
 * Celebrate a quest completion on Farcaster
 */
export async function celebrateCompletion(username: string, questTitle: string): Promise<void> {
    const text = `🎉 QUEST COMPLETED!\n\n@${username} just finished: "${questTitle}"\n\nKeep building on @base! 🔵\n#OpenQuest #Base #Onchain`;

    await postCast(text);
}

export default {
    announceNewQuest,
    celebrateCompletion,
    startMentionListener
};
