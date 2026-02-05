# OpenClaw Integration - Summary

## ✅ What's Been Set Up

### 1. **OpenClaw Agent Handler**
**File**: `services/openclawAgent.ts`

Handles all messaging platform interactions:
- ✅ Command routing (quests, stats, claim, help, leaderboard)
- ✅ Wallet linking system
- ✅ AI conversation with Gemini (context-aware)
- ✅ Quest formatting for chat
- ✅ Reward claiming
- ✅ User statistics

### 2. **OpenClaw Configuration**
**File**: `.openclaw/config.json`

Pre-configured for:
- WhatsApp integration (enabled by default)
- Telegram support (disabled, add token to enable)
- Discord support (disabled, add token to enable)
- Mention patterns in groups (@basequest, @quest)
- Gemini AI system prompt

### 3. **Documentation**
**File**: `OPENCLAW_INTEGRATION.md`

Complete guide including:
- Installation instructions
- User interaction examples
- Configuration options
- Security best practices
- Troubleshooting guide
- Multi-platform setup

### 4. **Environment Variables**
**File**: `.env.example`

Added OpenClaw configuration section for:
- Gateway port and bind settings
- Telegram bot token
- Discord bot token

### 5. **Setup Script**
**File**: `setup-openclaw.bat`

Automated Windows setup script that:
- Checks if OpenClaw is installed
- Installs it if missing
- Guides through onboarding wizard
- Shows next steps

---

## 🚀 How to Use

### Quick Start (3 Steps)

```bash
# 1. Run the setup script
setup-openclaw.bat

# 2. Start OpenClaw gateway (Terminal 1)
openclaw gateway --port 18789

# 3. Pair WhatsApp (Terminal 2)
openclaw channels login
# Scan QR code with WhatsApp app
```

---

## 💬 User Commands

Once set up, users can message BaseQuest on WhatsApp/Telegram/Discord:

| Command | Response |
|---------|----------|
| `quests` | Shows active quests with difficulty, rewards, time left |
| `link 0x...` | Links user's wallet address |
| `stats` | Shows user's quest completion stats |
| `claim` | Claims rewards for completed quests |
| `leaderboard` | Shows top 10 quest completers |
| `help` | Lists all available commands |
| Natural chat | AI responds with context using Gemini |

---

## 🎯 Example User Flow

```
User WhatsApp Message:
"Hey, what quests are available?"

BaseQuest Response:
🎯 Active Quests on Base (2)

1. Swap on Uniswap Base
🟢 EASY | 💱 DEFI
🏛️  Protocol: Uniswap
🎁 Reward: 25 QUEST
⏰ 23h left
👥 142 completed

2. Mint BasePaint NFT
🟢 EASY | 🖼️ NFT
🏛️  Protocol: BasePaint
🎁 Reward: Creator Badge
⏰ 11h left
👥 89 completed

💡 Link your wallet to start:
Send "link 0xYourAddress"
```

---

## 🔧 Integration Points

### Current Implementation (Demo Mode)
- ✅ OpenClaw message routing
- ✅ Gemini AI conversations
- ✅ Mock quest data
- ✅ Wallet address storage (in-memory)
- ✅ Command parsing

### Next Steps for Production
- [ ] Connect to deployed smart contract
- [ ] Real blockchain monitoring
- [ ] Persistent wallet storage (Redis/DB)
- [ ] Webhook notifications for completions
- [ ] Multi-language support

---

## 📊 Architecture

```
User (WhatsApp/Telegram/Discord)
           ↓
   OpenClaw Gateway
    (localhost:18789)
           ↓
  OpenClaw Agent Handler
   (openclawAgent.ts)
           ↓
    ┌──────┴──────┐
    ↓             ↓
Gemini AI    Smart Contract
(Conversation) (Quest Data)
```

---

## 🎨 Customization

### Change AI Personality

Edit `.openclaw/config.json`:

```json
{
  "agent": {
    "systemPrompt": "You are BaseQuest, a super enthusiastic quest guide! Use lots of emojis and get users excited about onchain adventures! 🚀🎯"
  }
}
```

### Add More Platforms

#### Telegram:
1. Create bot via @BotFather
2. Add token to `.openclaw/config.json`:
   ```json
   { "channels": { "telegram": { "enabled": true, "botToken": "YOUR_TOKEN" } } }
   ```

#### Discord:
1. Create app at discord.com/developers
2. Add token to config:
   ```json
   { "channels": { "discord": { "enabled": true, "botToken": "YOUR_TOKEN" } } }
   ```

---

## 🔐 Security Notes

1. **Wallet Links**: Stored in-memory (use Redis/DB in production)
2. **Gateway Token**: Required for non-loopback binds
3. **Whitelist**: Configure `allowFrom` to restrict access
4. **Mentions**: Groups require @basequest mention by default

---

## 📱 What Users See

BaseQuest becomes accessible from:
- ✅ WhatsApp (scan QR to link)
- ✅ Telegram (add bot)
- ✅ Discord (invite bot to server)
- ✅ iMessage (macOS only)

**No website needed!** Users complete quests entirely through chat.

---

## 🎉 Benefits

| Without OpenClaw | With OpenClaw |
|-----------------|---------------|
| Website only | WhatsApp, Telegram, Discord, iMessage |
| Must visit basequest.app | Chat from anywhere |
| Browser required | Mobile-first |
| Limited reach | Billions of users |
| Complex onboarding | "Just message us!" |

---

## 🛠️ Development Tips

### Testing Commands Locally

```bash
# Send test message
openclaw message send --target +1234567890 --message "quests"

# View logs
openclaw logs --follow

# Check gateway status
openclaw doctor
```

### Debugging

```bash
# Restart gateway
openclaw gateway --port 18789

# Re-login WhatsApp
openclaw channels logout
openclaw channels login
```

---

## 📚 Resources

- **OpenClaw Docs**: https://docs.openclaw.ai
- **GitHub**: https://github.com/openclaw/openclaw
- **BaseQuest Contract**: `contracts/BaseQuest.sol`
- **Integration Guide**: `OPENCLAW_INTEGRATION.md`

---

## 🚦 Status

- ✅ OpenClaw installation: In progress
- ✅ Agent handler: Complete
- ✅ Configuration: Complete
- ✅ Documentation: Complete
- ⏳ WhatsApp pairing: Pending (run `openclaw channels login`)
- ⏳ Smart contract connection: Pending deployment

---

## Next Action Required

**Run this command to pair WhatsApp:**

```bash
openclaw channels login
```

Then scan the QR code with your WhatsApp mobile app!

Users can then chat with BaseQuest directly on WhatsApp 🚀
