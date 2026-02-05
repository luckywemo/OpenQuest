# OpenClaw Integration for BaseQuest

## 🦞 What is OpenClaw?

OpenClaw is a multi-platform messaging gateway that connects AI agents to:
- 📱 WhatsApp (via Baileys)
- ✈️ Telegram
- 🎮 Discord
- 💬 iMessage (macOS)

This allows users to interact with BaseQuest through their preferred messaging app!

---

## 🚀 Quick Start

### 1. Install OpenClaw

```bash
# Global install (recommended)
npm install -g openclaw@latest

# Verify installation
openclaw --version
```

### 2. Run Onboarding Wizard

```bash
# This will guide you through setup
openclaw onboard --install-daemon

# Follow prompts to:
# - Set up gateway configuration
# - Generate security token
# - Install as system service (optional)
```

### 3. Start the Gateway

```bash
# Start OpenClaw gateway
openclaw gateway --port 18789

# Gateway dashboard available at:
# http://localhost:18789
```

### 4. Pair WhatsApp

```bash
# In a new terminal, login to WhatsApp
openclaw channels login

# Scan the QR code with WhatsApp mobile app
# Go to: Settings > Linked Devices > Link a Device
```

---

## 📱 User Interaction Flow

### **WhatsApp Example**

```
User: Hi BaseQuest!

BaseQuest: 👋 Welcome to BaseQuest!

I help you discover and complete onchain quests on Base blockchain.

To get started, link your wallet:
Send "link 0xYourWalletAddress"

Or see active quests:
Send "quests"

---

User: quests

BaseQuest: 🎯 Active Quests on Base (2)

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

---

User: link 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

BaseQuest: ✅ Wallet linked successfully!

Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

You can now:
• Complete quests and get auto-verified
• Claim rewards
• Track your stats
• Compete on the leaderboard

Send "quests" to see active quests!

---

[User completes Uniswap swap]

BaseQuest: 🎉 Quest Completed!

I detected your swap on Uniswap Base!

Quest: Swap on Uniswap Base
Reward: 25 QUEST tokens

Send "claim" to receive your reward

---

User: claim

BaseQuest: 🎉 Reward Claimed!

Quest: Swap on Uniswap Base
Reward: 25 QUEST tokens

Transaction submitted!
TX: 0xabc123...

View on BaseScan:
https://basescan.org/tx/0xabc123...

Total rewards claimed: 5
Send "stats" to see your progress!
```

---

## 🎯 Available Commands

| Command | Description |
|---------|-------------|
| `quests` | View all active quests |
| `link 0x...` | Link your wallet address |
| `stats` | See your quest statistics |
| `claim` | Claim rewards for completed quests |
| `leaderboard` | View top quest completers |
| `help` | Show all available commands |
| Chat naturally | Ask BaseQuest anything! |

---

## 🛠️ Configuration

### OpenClaw Config Location
`c:\Users\H\Desktop\app\BaseQuest\.openclaw\config.json`

### Key Settings

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["*"],  // Or specific numbers: ["+1234567890"]
      "groups": {
        "*": {
          "requireMention": true  // Requires @basequest in groups
        }
      }
    }
  },
  "messages": {
    "groupChat": {
      "mentionPatterns": ["@basequest", "@quest"]
    }
  },
  "gateway": {
    "port": 18789,
    "bind": "loopback"  // Or "tailnet" for remote access
  }
}
```

---

## 🔐 Security

### Recommended Settings

1. **Whitelist Phone Numbers** (for private agents):
   ```json
   {
     "channels": {
       "whatsapp": {
         "allowFrom": ["+1234567890", "+0987654321"]
       }
     }
   }
   ```

2. **Require Mentions in Groups**:
   ```json
   {
     "groups": {
       "*": {
         "requireMention": true
       }
     }
   }
   ```

3. **Use Gateway Token** (for remote access):
   ```bash
   openclaw gateway --bind tailnet --token YOUR_SECRET_TOKEN
   ```

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│  Users (WhatsApp/Telegram/Discord)  │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  OpenClaw Gateway                   │
│  ws://127.0.0.1:18789               │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  BaseQuest Agent Handler            │
│  (services/openclawAgent.ts)        │
└────────────────┬────────────────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
┌─────────────┐  ┌──────────────────┐
│  Gemini AI  │  │  Smart Contract  │
│  (Gemini)   │  │  (Base Network)  │
└─────────────┘  └──────────────────┘
```

---

## 🚧 Development Mode

### Running Locally

```bash
# Terminal 1: Start OpenClaw Gateway
openclaw gateway --port 18789

# Terminal 2: Start BaseQuest Frontend
cd c:\Users\H\Desktop\app\BaseQuest
npm run dev

# Terminal 3: Monitor OpenClaw logs
openclaw logs --follow
```

### Testing Commands

```bash
# Send test message (once WhatsApp is paired)
openclaw message send --target +1234567890 --message "quests"
```

---

## 🌐 Adding More Platforms

### Telegram Bot

1. Create bot via [@BotFather](https://t.me/botfather)
2. Get bot token
3. Update config:
   ```json
   {
     "channels": {
       "telegram": {
         "enabled": true,
         "botToken": "YOUR_BOT_TOKEN"
       }
     }
   }
   ```

### Discord Bot

1. Create app at [discord.com/developers](https://discord.com/developers/applications)
2. Get bot token
3. Update config:
   ```json
   {
     "channels": {
       "discord": {
         "enabled": true,
         "botToken": "YOUR_DISCORD_TOKEN"
       }
     }
   }
   ```

---

## 🔧 Troubleshooting

### WhatsApp QR Code Not Showing

```bash
# Re-run login
openclaw channels logout
openclaw channels login
```

### Gateway Won't Start

```bash
# Check if port is in use
netstat -ano | findstr :18789

# Try different port
openclaw gateway --port 19000
```

### Messages Not Being Received

```bash
# Check gateway status
openclaw doctor

# View real-time logs
openclaw logs --follow
```

---

## 📈 Production Deployment

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start OpenClaw with PM2
pm2 start "openclaw gateway --port 18789" --name basequest-openclaw

# Auto-restart on system reboot
pm2 startup
pm2 save
```

### Remote Access via Tailscale

```bash
# Install Tailscale
# https://tailscale.com/download

# Start gateway on tailnet
openclaw gateway --bind tailnet --token YOUR_SECRET_TOKEN

# Access from anywhere in your tailnet
```

---

## 🎨 Customization

### Custom System Prompt

Edit `.openclaw/config.json`:

```json
{
  "agent": {
    "systemPrompt": "You are BaseQuest, the friendliest quest agent on Base! Help users earn rewards through DeFi, NFT, and social quests. Be enthusiastic and use emojis! 🚀"
  }
}
```

### Custom Mention Patterns

```json
{
  "messages": {
    "groupChat": {
      "mentionPatterns": [
        "@basequest",
        "hey quest",
        "quest bot"
      ]
    }
  }
}
```

---

## 📚 Resources

- **OpenClaw Docs**: https://docs.openclaw.ai
- **GitHub**: https://github.com/openclaw/openclaw
- **BaseQuest Docs**: [Coming soon]

---

## 🎯 Next Steps

1. ✅ Install OpenClaw
2. ✅ Pair WhatsApp (or other platforms)
3. ✅ Link your wallet address
4. ✅ Complete your first quest
5. ✅ Share with friends!

---

## 💡 Tips

- **Group Chats**: Mention `@basequest` to trigger the bot
- **Private DMs**: No mention needed, just chat naturally
- **Multiple Users**: Each user links their own wallet
- **Multi-Platform**: Same account works across WhatsApp/Telegram/Discord

---

Need help? Send "help" to BaseQuest on any platform!
