import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Testing Twitter API Authentication...\n');

// Test 1: Bearer Token (OAuth 2.0)
console.log('TEST 1: Bearer Token Authentication');
try {
    const bearerClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    const me = await bearerClient.v2.me();
    console.log('✅ Bearer Token WORKS!');
    console.log(`   User: @${me.data.username}`);
    console.log(`   ID: ${me.data.id}\n`);
} catch (error) {
    console.error('❌ Bearer Token FAILED');
    console.error(`   Error: ${error.message}\n`);
}

// Test 2: OAuth 1.0a (Access Token + Secret)
console.log('TEST 2: OAuth 1.0a Authentication');
try {
    const oauthClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    const me2 = await oauthClient.v2.me();
    console.log('✅ OAuth 1.0a WORKS!');
    console.log(`   User: @${me2.data.username}`);
    console.log(`   ID: ${me2.data.id}\n`);

    // Try posting
    console.log('TEST 3: Attempting to post tweet...');
    const tweet = await oauthClient.v2.tweet('🧪 Test tweet from OpenQuest setup! Ignore me! 🤖');
    console.log('✅ TWEET POSTED SUCCESSFULLY!');
    console.log(`   Tweet ID: ${tweet.data.id}`);
    console.log(`   Link: https://twitter.com/${process.env.TWITTER_BOT_USERNAME}/status/${tweet.data.id}\n`);

} catch (error) {
    console.error('❌ OAuth 1.0a FAILED');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    if (error.data) {
        console.error(`   Details: ${JSON.stringify(error.data, null, 2)}\n`);
    }
}

console.log('\n════════════════════════════════════════');
console.log('DIAGNOSIS:');
console.log('════════════════════════════════════════');
console.log('If Test 1 passed but Test 2 failed:');
console.log('→ Bearer token works, OAuth 1.0a broken');
console.log('→ Check app permissions and app type\n');
console.log('If both failed:');
console.log('→ Need Elevated access or new app\n');
console.log('If Test 3 succeeded:');
console.log('→ Everything works! Check bot code\n');
