import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

interface BankrConfig {
    apiKey: string;
    apiUrl: string;
}

interface BankrJobResponse {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    error?: string;
}

const CONFIG_PATH = path.join(process.cwd(), '.skills', 'bankr', 'config.json');
const SCRIPT_PATH = path.join(process.cwd(), '.skills', 'bankr', 'scripts', 'bankr.sh');

/**
 * Load Bankr configuration from config.json
 */
function loadConfig(): BankrConfig | null {
    if (!existsSync(CONFIG_PATH)) {
        console.warn('⚠️ Bankr config not found. Please set up your API key at .skills/bankr/config.json');
        return null;
    }

    try {
        const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
        return config;
    } catch (error) {
        console.error('❌ Failed to load Bankr config:', error);
        return null;
    }
}

/**
 * Execute a Bankr command using the bankr.sh script
 */
export async function executeBankrCommand(prompt: string): Promise<string> {
    const config = loadConfig();

    if (!config) {
        return '❌ Bankr is not configured. Please set up your API key first.\n\nVisit https://bankr.bot/api to create an API key, then save it to .skills/bankr/config.json';
    }

    if (!existsSync(SCRIPT_PATH)) {
        return '❌ Bankr script not found. Please ensure the bankr skill is installed at .skills/bankr/';
    }

    try {
        // Execute the bankr.sh script with the prompt
        const result = execSync(`bash "${SCRIPT_PATH}" "${prompt.replace(/"/g, '\\"')}"`, {
            cwd: path.join(process.cwd(), '.skills', 'bankr'),
            encoding: 'utf-8',
            timeout: 30000, // 30 second timeout
            env: {
                ...process.env,
                BANKR_CONFIG_PATH: CONFIG_PATH
            }
        });

        return result.trim();
    } catch (error: any) {
        console.error('❌ Bankr command failed:', error);
        return `❌ Failed to execute Bankr command: ${error.message}`;
    }
}

/**
 * Check if Bankr is configured and available
 */
export function isBankrAvailable(): boolean {
    return existsSync(CONFIG_PATH) && existsSync(SCRIPT_PATH);
}

/**
 * Get help text for Bankr commands
 */
export function getBankrHelp(): string {
    return `
🪙 **Bankr Crypto Trading**

Available commands:
- \`bankr [command]\` - Execute any Bankr trading command

**Trading:**
- "Buy $50 of ETH on Base"
- "Swap 0.1 ETH for USDC"
- "Sell 50% of my PEPE"

**Portfolio:**
- "Show my portfolio"
- "What's my ETH balance?"
- "Total portfolio value"

**Market:**
- "What's the price of Bitcoin?"
- "Analyze ETH price"
- "Trending tokens on Base"

**Transfers:**
- "Send 0.1 ETH to vitalik.eth"
- "Transfer $20 USDC to @friend"

**NFTs:**
- "Show Bored Ape floor price"
- "Show my NFTs"

**Automation:**
- "DCA $100 into ETH weekly"
- "Set limit order to buy ETH at $3,000"

${isBankrAvailable() ? '✅ Bankr is configured and ready' : '⚠️ Bankr not configured - visit https://bankr.bot/api to get started'}
`;
}

/**
 * Common Bankr commands for quest rewards
 */
export const BANKR_QUEST_COMMANDS = {
    checkBalance: 'What is my portfolio balance?',
    checkETH: 'What is my ETH balance on Base?',
    buyETH: (amount: string) => `Buy $${amount} of ETH on Base`,
    claimReward: (token: string, amount: string) => `Check my ${token} balance on Base`,
};
