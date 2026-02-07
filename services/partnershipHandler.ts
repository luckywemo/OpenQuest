/**
 * Partnership Request Handler
 * Auto-detects and responds to partnership/sponsorship requests
 */

import { v2Client } from './twitterBot.js';

// Partnership detection keywords
const PARTNERSHIP_KEYWORDS = [
    'partnership',
    'sponsor',
    'collaborate',
    'quest request',
    'submit quest',
    'create quest',
    'campaign',
    'advertising'
];

/**
 * Check if a mention is a partnership request
 */
export function isPartnershipRequest(text: string): boolean {
    const lowerText = text.toLowerCase();
    return PARTNERSHIP_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Handle partnership request with auto-response
 */
export async function handlePartnershipRequest(
    tweetId: string,
    username: string,
    text: string
): Promise<void> {
    try {
        console.log(`💼 Partnership request detected from @${username}`);

        const response = `@${username} Awesome! 🤝 We'd love to work with you!

📧 Partnership Details:
• Quest packages from $300 USDC
• Custom campaigns available
• Direct onchain user acquisition

DM us or email: openquest@proton.me
Let's build something great! 🚀

#OpenQuest #BasePartners`;

        await v2Client.reply(response, tweetId);
        console.log(`💼 Partnership info sent to @${username}`);

        // Log for manual follow-up
        console.log(`\n${'='.repeat(50)}`);
        console.log(`📝 NEW PARTNERSHIP LEAD`);
        console.log(`${'='.repeat(50)}`);
        console.log(`From: @${username}`);
        console.log(`Message: "${text.substring(0, 150)}..."`);
        console.log(`Time: ${new Date().toLocaleString()}`);
        console.log(`${'='.repeat(50)}\n`);

    } catch (error) {
        console.error(`Error handling partnership request from @${username}:`, error);
    }
}
