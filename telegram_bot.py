from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Your bot token here
BOT_TOKEN = '6589753473:AAEJFp8iYg8Jm5rUWKN2Q-chlYo6OTc-pUg'
GAME_URL = 'https://anbessaa.github.io/brain/'

def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text('Welcome to the Game! Click the link below to start playing:')
    update.message.reply_text(GAME_URL)

def main():
    updater = Updater(BOT_TOKEN, use_context=True)
    dispatcher = updater.dispatcher

    dispatcher.add_handler(CommandHandler("start", start))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
