require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { Connection } = require("@solana/web3.js");
const fetch = require("node-fetch");

// Load from .env
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

// Init Telegram bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Init Solana connection
const connection = new Connection(HELIUS_RPC_URL, "confirmed");

// ---------------- Commands ---------------- //

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "🚀 Welcome! This bot is powered by Solana + Saros DLMM.\n\n" +
      "Commands:\n" +
      "• /slot → latest Solana slot\n" +
      "• /balance <wallet> → check SOL balance\n" +
      "• /lp <wallet> → LP positions\n" +
      "• /history <wallet> → recent transactions"
  );
});

// /slot
bot.onText(/\/slot/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const slot = await connection.getSlot();
    bot.sendMessage(chatId, `📡 Current Solana slot: ${slot}`);
  } catch (err) {
    bot.sendMessage(chatId, `❌ Error fetching slot: ${err.message}`);
  }
});

// /balance <wallet>
bot.onText(/\/balance (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const wallet = match[1].trim();

  try {
    const balanceLamports = await connection.getBalance(wallet);
    const balanceSol = balanceLamports / 1e9;
    bot.sendMessage(chatId, `💰 Balance for ${wallet}:\n${balanceSol} SOL`);
  } catch (err) {
    bot.sendMessage(chatId, `❌ Error fetching balance: ${err.message}`);
  }
});

// /lp <wallet>
bot.onText(/\/lp (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const wallet = match[1].trim();

  try {
    const url = `${HELIUS_RPC_URL}/v0/addresses/${wallet}/transactions?api-key=${HELIUS_API_KEY}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.length === 0) {
      return bot.sendMessage(chatId, "📭 No LP positions found for this wallet.");
    }

    let response = `📊 LP Data for *${wallet.slice(0, 6)}...${wallet.slice(-4)}*:\n\n`;
    data.slice(0, 3).forEach((tx, i) => {
      response += `${i + 1}. Tx: \`${tx.signature}\`\n`;
    });

    bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
  } catch (err) {
    bot.sendMessage(chatId, "❌ Error fetching LP data. Try again later.");
  }
});

// /history <wallet>
bot.onText(/\/history (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const wallet = match[1].trim();

  try {
    const url = `${HELIUS_RPC_URL}/v0/addresses/${wallet}/transactions?api-key=${HELIUS_API_KEY}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || data.length === 0) {
      return bot.sendMessage(chatId, "📭 No transactions found for this wallet.");
    }

    let response = `🧾 Recent transactions for *${wallet.slice(0, 6)}...${wallet.slice(-4)}*:\n\n`;
    data.forEach((tx, i) => {
      response += `${i + 1}. Sig: \`${tx.signature}\`\n`;
    });

    bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
  } catch (err) {
    bot.sendMessage(chatId, "❌ Error fetching history. Try again later.");
  }
});
