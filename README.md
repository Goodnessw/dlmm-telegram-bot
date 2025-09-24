# DLMM Telegram Bot

A Telegram bot powered by **Solana** and the **Saros DLMM SDK**.  
It lets users interact with the blockchain directly from Telegram — starting with basic commands like fetching Solana slot data.  

This bot is being built for the **Saros DLMM Demo Challenge**. 🚀

## Features

✅ `/start` → Welcome message  
✅ `/slot` → Fetch latest Solana slot via Helius RPC  
🔜 Planned: LP position management, transaction history lookup, and advanced order tools

## Setup

1. Clone this repo
   ```bash
   git clone https://github.com/Goodnessw/dlmm-telegram-bot.git
   cd dlmm-telegram-bot

2. Install dependencies
    npm install

3. Create a .env file with:
    TELEGRAM_BOT_TOKEN=your_telegram_bot_token
    HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=your_helius_api_key

4. npm start
    npm start




