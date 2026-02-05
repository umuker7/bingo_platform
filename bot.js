const TelegramBot = require("node-telegram-bot-api");
const token="8509984485:AAGOobdpKMyG7n7j29072Unr0ZWPYQiqEQw";
const webappUrl="PASTE_YOUR_RENDER_URL_HERE";

const bot=new TelegramBot(token,{polling:true});
bot.onText(/\/start/, (msg)=>{
  bot.sendMessage(msg.chat.id,"🎯 PLUS BINGO እንኳን ደህና መጡ!",{
    reply_markup:{inline_keyboard:[[{text:"🚀 Play Bingo",web_app:{url:webappUrl}}]]}
  });
});
