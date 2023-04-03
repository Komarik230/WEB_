import os
import logging
from telegram.ext import Application, MessageHandler, filters, CommandHandler
from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove
from dotenv import load_dotenv

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.DEBUG
)

logger = logging.getLogger(__name__)
load_dotenv()
token = os.getenv('token')


class User:
    def __init__(self):
        self.is_guest = True

    async def start(self, update, context):
        reply_keyboard = [['/menu']]
        markup = ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=False)
        await update.message.reply_text(
            text='that you may do',
            reply_markup=markup
        )

    async def menu(self, update, context):
        if self.is_guest:
            reply_keyboard = [['/reg', '/log'], ['/chat_gpt']]
        else:
            reply_keyboard = [['/my_acc', '/log_out'], ['/chat_gpt']]
        markup = ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=False)
        await update.message.reply_text(
            text='that you may do',
            reply_markup=markup
        )

    async def log(self, update, context):
        await update.message.reply_text(
            "Enter your login",
            reply_markup=ReplyKeyboardRemove()
        )

    def main(self):
        application = Application.builder().token(token).build()
        application.add_handler(CommandHandler("start", self.start))
        application.add_handler(CommandHandler("menu", self.menu))
        application.add_handler(CommandHandler("log", self.log))
        # text_handler = MessageHandler(filters.TEXT, echo)
        # application.add_handler(text_handler)
        application.run_polling()


# Запускаем функцию main() в случае запуска скрипта.
if __name__ == '__main__':
    us1 = User()
    us1.main()
