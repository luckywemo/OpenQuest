# Twitter/X Integration for BaseQuest

## 🐦 Overview

BaseQuest now supports Twitter/X alongside OpenClaw (WhatsApp/Telegram/Discord)! This gives you the best of both worlds:
- **Twitter**: Public engagement, viral growth, crypto community
- **OpenClaw**: Private messaging, direct support, chat platforms

---

## 🚀 Quick Start

### 1. Get Twitter API Credentials

1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create a new app (select "Free" tier)
3. In your app dashboard:
   - Go to "Keys and tokens"
   - Generate API Key & Secret
   - Generate Access Token & Secret (with Read and Write permissions)
   - Copy the Bearer Token

### 2. Add Credentials to .env

```bash
# Copy .env.example to .env if you haven't
cp .env.example .env

# Edit .env and add:
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
TWITTER_BEARER_TOKEN=your_bearer_token_here

# Bot configuration
TWITTER_BOT_USERNAME=OpenQuestBot
ENABLE_TWITTER=true

# Keep Gemini key
GEMINI_API_KEY=your_gemini_key
```

### 3. Run the Bot

```bash
# Install dependencies (if not done)
npm install

# Compile TypeScript
npx tsc bot.ts --outDir dist --module commonjs --esModuleInterop

# Run the bot
node dist/bot.js
```

---

## 💬 User Interaction Examples

### **Mentions**

```
User: @OpenQuestBot quests

OpenQuestBot: @user 🎯 Active Quests:

1️⃣ Swap on Uniswap Base
   🟢 EASY | 💱 DEFI
   Reward: 25 QUEST | ⏰ 23h left

2️⃣ Mint BasePaint NFT
   🟢 EASY | 🖼️ NFT
   Reward: Creator Badge | ⏰ 11h left

DM me "link 0xYourAddress" to start!
More: basequest.app
```

```
User: @OpenQuestBot how do quests work?

OpenQuestBot: @user 📖 How BaseQuest Works:

1️⃣ DM me: "link 0xYourAddress"
2️⃣ Complete onchain actions (swap, mint, etc)
3️⃣ I auto-detect within 30 seconds! ⚡
4️⃣ Reply "claim" to get rewards

Start: basequest.app
```

```
User: @OpenQuestBot stats

OpenQuestBot: @user 📊 Your Stats:

✅ Completed: 5 quests
🎁 Rewards: 4 claimed
🔥 Streak: 3 days
🏅 Badges: 4

Keep crushing it! 💪
```

### **DMs (Direct Messages)**

```
User DM: link 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

OpenQuestBot DM: ✅ Wallet linked!

Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

You can now:
• Complete quests
• Get auto-verified
• Claim rewards
• Track stats

Mention me with "quests" to see what's active! 🎯
```

### **Auto Announcements**

When a new quest is created:

```
OpenQuestBot: 🎯 NEW QUEST LIVE ON BASE

Swap on Uniswap Base

🟢 EASY | 💱 DEFI
🏛️ Uniswap
🎁 25 QUEST

⏰ 23h left

Reply "how" to learn more! 👇

#Base #BaseQuest #Onchain
```

When someone completes a quest:

```
OpenQuestBot: 🎉 QUEST COMPLETED!

@cryptowhale just crushed:
"Swap on Uniswap Base"

🟢 EASY DEFI quest ✅

Reply "claim" to get your reward!

#BaseQuest #Base
```

---

## 🤖 Available Commands

| Mention Command | Response |
|----------------|----------|
| `@OpenQuestBot quests` | Shows active quests |
| `@OpenQuestBot stats` | Shows user's statistics |
| `@OpenQuestBot how` | Explains how quests work |
| `@OpenQuestBot help` | Lists all commands |
| `@OpenQuestBot claim` | Claims rewards |
| `@OpenQuestBot leaderboard` | Shows top users |
| `@OpenQuestBot [anything else]` | AI-powered response via Gemini |

| DM Command | Response |
|-----------|----------|
| `link 0xYourAddress` | Links wallet to Twitter account |

---

## 🤖 Features

### 1. **Mention Listening**
- Bot monitors all mentions of `@YourBotUsername`
- Responds within seconds
- Routes commands to appropriate handlers
- Falls back to AI for unrecognized queries

### 2. **DM Support**
- Users can DM to link wallets privately
- Secure wallet address storage
- No public exposure of addresses

### 3. **Auto Announcements**
- New quests auto-tweeted
- Completion celebrations
- Daily stats summaries
- Customizable schedule

### 4. **AI Conversations**
- Powered by Gemini
- Context-aware responses
- Stays under 280 characters
- Friendly and helpful

### 5. **Smart Reply Threading**
- Automatically replies to mentions
- Maintains conversation threads
- Avoids duplicate responses

---

## 📊 Bot Architecture

```
Twitter Users
      ↓
Twitter API v2
      ↓
  ┌───┴───┐
  ↓       ↓
Mentions  DMs
  ↓       ↓
Command Router
  ↓
┌─┴─┬─┬─┬─┬──┐
↓   ↓ ↓ ↓ ↓  ↓
quests stats claim help leaderboard AI
  ↓   ↓ ↓ ↓ ↓  ↓
Gemini AI + Smart Contract
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Required
TWITTER_API_KEY=xxx
TWITTER_API_SECRET=xxx
TWITTER_ACCESS_TOKEN=xxx
TWITTER_ACCESS_SECRET=xxx
TWITTER_BEARER_TOKEN=xxx
GEMINI_API_KEY=xxx

# Optional
TWITTER_BOT_USERNAME=OpenQuestBot
ENABLE_TWITTER=true
ENABLE_AUTO_QUESTS=true
QUEST_INTERVAL_HOURS=24
```

### Auto Quest Generation

Set in `.env`:

```bash
ENABLE_AUTO_QUESTS=true
QUEST_INTERVAL_HOURS=24  # Generate new quest every 24 hours
```

The bot will:
1. Generate a new quest using Gemini
2. Tweet about it automatically
3. Repeat on schedule

---

## 🔐 Security Best Practices

### 1. **Never Commit Credentials**
- ✅ Use `.env` for all secrets
- ✅ Add `.env` to `.gitignore`
- ❌ Never hardcode API keys

### 2. **API Key Permissions**
- Use Read + Write permissions (not Elevated)
- Regenerate tokens if compromised
- Monitor API usage in Twitter dashboard

### 3. **Wallet Address Validation**
- Always validate addresses with `ethers.isAddress()`
- Store addresses in lowercase
- Use database in production (not Map)

### 4. **Rate Limiting**
- Twitter API has rate limits
- Bot implements automatic retry logic
- Monitor limits in Twitter developer dashboard

---

## 🚧 Development Tips

### Testing Locally

```bash
# Run bot in dev mode
npm run dev

# Test a specific command
# (mention your bot on Twitter)
@YourBotName quests
```

### Monitoring

```bash
# Bot logs all activity to console
# Look for:
# 📥 Mention received
# 📢 Quest announced
# 💬 DM processed
# ✅ Command handled
```

### Debugging

```typescript
// Enable verbose logging in twitterBot.ts
console.log('Debug:', tweetData);
```

---

## 🌐 Multi-Platform Strategy

### When to Use Twitter vs OpenClaw

| Use Twitter For | Use OpenClaw For |
|----------------|------------------|
| Public announcements | Private support |
| Viral growth | Direct user help |
| Community building | Wallet linking |
| Quest celebrations | Status checks |
| Leaderboard posts | Detailed explanations |

### Unified Experience

Both platforms use the same:
- ✅ Command system
- ✅ Wallet linking
- ✅ Quest data
- ✅ AI responses

User can start on Twitter and continue on WhatsApp seamlessly!

---

## 📈 Growth Strategies

### 1. **Engage Top Crypto Accounts**
```typescript
// In twitterBot.ts, add:
const influencers = ['vitalik.eth', 'coinbase', 'base'];
// Mention them in quest announcements
```

### 2. **Use Trending Hashtags**
```typescript
const hashtags = ['#Base', '#Onchain', '#DeFi', '#BaseQuest'];
```

### 3. **Tweet Regularly**
- New quests: Immediate
- Completions: Real-time
- Daily stats: 9 AM UTC
- Leaderboard: Weekly

### 4. **Run Campaigns**
```typescript
// Special quest for followers
await v2Client.tweet(`
🎁 EXCLUSIVE QUEST FOR FOLLOWERS

First 100 to complete get 2x rewards!

Follow @OpenQuestBot and reply "in" to join

#BaseQuest
`);
```

---

## 🆘 Troubleshooting

### Bot Not Responding to Mentions

```bash
# Check stream rules
# Make sure @YourBotUsername rule is added

# Restart mention listener
# The bot auto-adds rules on startup
```

### "Forbidden" Error

- Check API key permissions (need Read + Write)
- Regenerate access tokens
- Verify app settings in Twitter dashboard

### Rate Limit Errors

- Twitter has rate limits (300 tweets per 3 hours)
- Bot will automatically retry
- Space out announcements

### DMs Not Working

- Enable DMs in Twitter app settings
- Check Privacy & safety > Direct messages
- Allow message requests from everyone

---

## 📚 Resources

- **Twitter API Docs**: https://developer.twitter.com/en/docs
- **twitter-api-v2 Library**: https://github.com/PLhery/node-twitter-api-v2
- **BaseQuest Contract**: `contracts/BaseQuest.sol`
- **OpenClaw Docs**: https://docs.openclaw.ai

---

## 🎯 Next Steps

1. ✅ Get Twitter API credentials
2. ✅ Add to `.env` file
3. ✅ Run `npm install` (already done)
4. ✅ Start the bot: `node dist/bot.js`
5. ✅ Mention your bot on Twitter to test!

---

## 💡 Pro Tips

- **Pin Important Tweets**: Pin quest announcements
- **Use Twitter Polls**: Let community vote on next quest
- **Thread Longer Content**: Break explanations into threads
- **Engage Replies**: Bot can continue conversations
- **Cross-Promote**: Mention OpenClaw in Twitter, vice versa

---

Need help? Mention your bot with "help" or check the logs! 🚀
