from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = '6589753473:AAEJFp8iYg8Jm5rUWKN2Q-chlYo6OTc-pUg'
GAME_URL = 'https://anbessaa.github.io/brain/'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    keyboard = [
        [InlineKeyboardButton("Start Game", web_app=WebAppInfo(url=GAME_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text('Click the button below to start the game:', reply_markup=reply_markup)

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    app.run_polling()

if __name__ == '__main__':
    main()
