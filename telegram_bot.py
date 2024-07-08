from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Your bot token here
BOT_TOKEN = '6589753473:AAEJFp8iYg8Jm5rUWKN2Q-chlYo6OTc-pUg'
GAME_URL = 'https://anbessaa.github.io/brain/'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text('Welcome to the Game! Click the link below to start playing:')
    await update.message.reply_text(GAME_URL)

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))

    app.run_polling()

if __name__ == '__main__':
    main()
