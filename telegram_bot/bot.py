import os
import logging
from telegram.ext import Application, MessageHandler, filters, CommandHandler, ConversationHandler, CallbackQueryHandler
from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from dotenv import load_dotenv
import sqlite3

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.DEBUG
)

TURNED_OFF, STARTED, IN_MENU, IN_LOGINING = range(4)

logger = logging.getLogger(__name__)
load_dotenv()
token = os.getenv('token')


class User:
    def __init__(self):
        self.is_guest = True
        self.keyboard_pos = 0
        self.keyboards = [
            [['Start']],
            [['Menu', 'Turn Off']],
            ([['Registration', 'Log in'], ["Chat GPT's stories", 'Return']],
             [['My profile', 'Log out'], ["Chat GPT's stories", 'Return']]),
            [['Return']]
        ]

    async def start(self, update, context):
        print(1)
        self.con = sqlite3.connect("../db/webproject.db")
        self.cur = self.con.cursor()
        self.keyboard_pos += 1
        self.reply_keyboard = self.keyboards[self.keyboard_pos]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=False)
        await update.message.reply_text(
            text='Hello',
            reply_markup=markup
        )
        return STARTED

    async def menu(self, update, context):
        self.keyboard_pos += 1
        if self.is_guest:
            self.reply_keyboard = self.keyboards[self.keyboard_pos][0]
        else:
            self.reply_keyboard = self.keyboards[self.keyboard_pos][1]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text='that you may do',
            reply_markup=markup
        )
        return IN_LOGINING

    async def stop(self, update, context):
        self.keyboard_pos = 0
        self.reply_keyboard = self.keyboards[self.keyboard_pos]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text="Всего доброго!",
            reply_markup=markup
        )
        return TURNED_OFF

    async def get_login(self, update, context):
        # login =
        # print(login)
        # res = self.cur.execute(f"""SELECT surname FROM users WHERE email = {login}""")
        # print(res)
        await update.message.reply_text(
            text=self.cur.execute(f"""SELECT surname FROM users WHERE email = '{update.message.text}'""").fetchone()
        )
        # return IN_MENU

    async def login(self, update, context):
        print(2)
        self.keyboard_pos = 3
        self.reply_keyboard = self.keyboards[self.keyboard_pos]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text="Введите логин",
            reply_markup=markup
        )

        return IN_LOGINING

    async def back(self, update, context):
        self.keyboard_pos -= 1
        self.reply_keyboard = self.keyboards[self.keyboard_pos]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(text='adadad',
                                        reply_markup=markup)
        return self.keyboard_pos

    def main(self):
        application = Application.builder().token(token).build()
        conv_handler = ConversationHandler(
            # точка входа в разговор
            entry_points=[CommandHandler('start', self.start)],
            # словарь состояний разговора, возвращаемых callback функциями
            states={
                STARTED: [
                    MessageHandler(
                        filters.Regex("Menu"), self.menu
                    ),
                    MessageHandler(
                        filters.Regex("Turn Off"), self.stop
                    )
                ],
                # Этап `SECOND` - происходит то же самое, что и в описании этапа `FIRST`
                IN_MENU: [
                    # MessageHandler(filters.Regex("Registration"), self.reg),
                    MessageHandler(filters.Regex("Log in"), self.login),
                    # MessageHandler(filters.Regex("My profile"), self.profile),
                    # MessageHandler(filters.Regex("Log out"), self.logout),
                    # MessageHandler(filters.Regex("Chat GPT's stories"), self.gpt),
                    MessageHandler(filters.Regex("Return"), self.back)
                ],
                TURNED_OFF: [
                    MessageHandler(filters.Regex("Start"), self.start)
                ],
                IN_LOGINING: [
                    MessageHandler(filters.TEXT, self.get_login)
                ]
            },
            # точка выхода из разговора
            fallbacks=[CommandHandler('start', self.start)]
        )
        application.add_handler(conv_handler)
        application.run_polling()


# Запускаем функцию main() в случае запуска скрипта.
if __name__ == '__main__':
    us1 = User()
    us1.main()
    us1.con.close()
