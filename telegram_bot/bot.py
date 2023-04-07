import os
import logging
from telegram.ext import Application, MessageHandler, filters, CommandHandler, ConversationHandler, CallbackQueryHandler
from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from dotenv import load_dotenv

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.DEBUG
)

CHOOSING, TYPING_REPLY, TYPING_CHOICE = range(3)

logger = logging.getLogger(__name__)
load_dotenv()
token = os.getenv('token')


class User:
    def __init__(self):
        self.is_guest = True
        self.prev_keyboard = []
        self.reply_keyboard = []

    async def start(self, update, context):
        self.reply_keyboard = [
            ['Menu', 'Turn Off']
        ]
        self.prev_keyboard = self.reply_keyboard
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text='Hello',
            reply_markup=markup
        )
        return CHOOSING

    async def menu(self, update, context):
        if self.is_guest:
            self.reply_keyboard = [['Registration', 'Log in'], ["Chat GPT's stories", 'Return']]
        else:
            self.reply_keyboard = [['My profile', 'Log out'], ["Chat GPT's stories", 'Return']]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text='that you may do',
            reply_markup=markup
        )
        self.prev_keyboard = self.reply_keyboard
        return CHOOSING

    async def stop(self, update, context):
        await update.message.reply_text("Всего доброго!")
        return ConversationHandler.END

    async def back(self, update, context):
        markup = ReplyKeyboardMarkup(self.prev_keyboard, one_time_keyboard=False)
        await update.message.reply_text(text='adadad',
                                        reply_markup=markup)
        return CHOOSING

    def main(self):
        application = Application.builder().token(token).build()
        conv_handler = ConversationHandler(
            # точка входа в разговор
            entry_points=[CommandHandler('start', self.start)],
            # словарь состояний разговора, возвращаемых callback функциями
            states={
                CHOOSING: [
                    MessageHandler(
                        filters.Regex("Menu"), self.menu
                    ),
                    MessageHandler(
                        filters.Regex("Turn Off"), self.stop
                    ),
                    MessageHandler(filters.Regex("Return"), self.back)
                ],
                # Этап `SECOND` - происходит то же самое, что и в описании этапа `FIRST`
                TYPING_REPLY: [
                ],
                TYPING_CHOICE: [
                ]
            },
            # точка выхода из разговора
            fallbacks=[CommandHandler('start', self.start),
                       MessageHandler(filters.Regex("Turn Off"), self.stop)
                       ]
        )
        application.add_handler(conv_handler)
        application.run_polling()


# Запускаем функцию main() в случае запуска скрипта.
if __name__ == '__main__':
    us1 = User()
    us1.main()
