# Bankr Integration Setup

This guide will help you set up Bankr crypto trading capabilities for OpenQuest.

## What is Bankr?

Bankr is an AI-powered crypto trading agent that enables natural language trading commands. Users can trade tokens, check portfolios, manage NFTs, and more across Base, Ethereum, Polygon, Solana, and Unichain.

## Quick Setup

### 1. Create a Bankr Account & API Key

1. Visit [bankr.bot](https://bankr.bot)
2. Sign up with your email (creates wallets automatically)
3. Navigate to [bankr.bot/api](https://bankr.bot/api)
4. Create an API key with **Agent API** access enabled
5. Copy the API key (starts with `bk_`)

### 2. Configure the Bankr Skill

Create the configuration file:

```bash
# Create config directory if it doesn't exist
mkdir -p .skills/bankr

# Create config.json with your API key
cat > .skills/bankr/config.json << 'EOF'
{
  "apiKey": "bk_YOUR_ACTUAL_API_KEY_HERE",
  "apiUrl": "https://api.bankr.bot"
}
EOF
```

Replace `bk_YOUR_ACTUAL_API_KEY_HERE` with your actual Bankr API key.

### 3. Test the Integration

If you're running the bot, users can now send trading commands via WhatsApp, Telegram, or Discord:

**Examples:**
- `portfolio` - View crypto balances
- `buy $10 of ETH on Base` - Purchase ETH
- `What's the price of Bitcoin?` - Check prices
- `show my NFTs` - View NFT collection
- `swap 0.1 ETH for USDC` - Token swaps

## Available Commands

### Trading
- Buy/sell/swap tokens across chains
- Cross-chain bridges
- Limit orders & stop losses
- DCA (dollar-cost averaging)

### Portfolio Management
- Check balances across all chains
- View USD valuations
- Real-time price updates

### Market Research
- Token prices and charts
- Technical analysis
- Trending tokens
- Token comparisons

### NFT Operations
- Browse collections
- Purchase NFTs
- View your NFT portfolio
- Transfer NFTs

### Advanced Features
- **Leverage Trading**: Up to 50x crypto, 100x forex via Avantis
- **Polymarket Betting**: Prediction markets
- **Token Deployment**: Launch tokens on Solana or Base
- **Automation**: Scheduled trades, DCA, stop-loss

## Security Notes

⚠️ **Important:**
1. Never share your API key
2. Keep `config.json` out of version control (already in `.gitignore`)
3. Start with small test amounts
4. Verify addresses before large transfers
5. Use stop losses for leverage trading

## Supported Chains

| Chain | Native Token | Best For |
|-------|-------------|----------|
| Base | ETH | Memecoins, low fees |
| Polygon | MATIC | Gaming, frequent trades |
| Ethereum | ETH | Blue chips, high liquidity |
| Solana | SOL | High-speed trading |
| Unichain | ETH | Newer L2 |

## Resources

- **Terminal**: https://bankr.bot/terminal
- **API Docs**: https://bankr.bot/api
- **Twitter**: @bankr_bot
- **Full Documentation**: See `.skills/bankr/SKILL.md`

## Troubleshooting

### "Bankr is not configured" error
- Verify `config.json` exists at `.skills/bankr/config.json`
- Check that your API key starts with `bk_`
- Ensure API key has "Agent API" access enabled

### Commands not working
- Make sure the bot is running (`npm run dev` or `npm start`)
- Check that scripts in `.skills/bankr/scripts/` are executable
- Verify internet connectivity to api.bankr.bot

### Need Help?
Send `help` to the bot to see all available commands.
