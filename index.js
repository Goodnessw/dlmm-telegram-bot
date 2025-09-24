require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { Connection } = require("@solana/web3.js");

// Load keys from .env
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;

// Init Telegram bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Init Solana connection
const connection = new Connection(HELIUS_RPC_URL, "confirmed");

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🚀 Welcome! This bot is powered by Solana + Saros DLMM.\nUse /slot to get the latest slot number.");
});

// Slot command
bot.onText(/\/slot/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const slot = await connection.getSlot();
    bot.sendMessage(chatId, `📡 Current Solana slot: ${slot}`);
  } catch (err) {
    bot.sendMessage(chatId, `❌ Error fetching slot: ${err.message}`);
  }
});
