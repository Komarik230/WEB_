import os
import logging
from telegram.ext import Application, MessageHandler, filters, CommandHandler, ConversationHandler, CallbackQueryHandler
from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from dotenv import load_dotenv
import sqlite3
import hashlib

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.DEBUG
)

TURNED_OFF, STARTED, IN_MENU, IN_LOGINING, IN_PASSWORD = range(5)

logger = logging.getLogger(__name__)
load_dotenv()
token = os.getenv('token')


class User:
    def __init__(self):
        self.login = None
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

    async def check_login(self, update, context):
        print(2)
        self.keyboard_pos = 3
        self.reply_keyboard = self.keyboards[self.keyboard_pos]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text="Введите логин",
            reply_markup=markup
        )
        print(1)
        self.login = update.message.text
        self.cur.execute(f"SELECT user_id FROM users WHERE login = '{self.login}'")
        if self.cur.fetchone() is None:
            await update.message.reply_text(
                text="Аккаунта не существует",
                reply_markup=markup
            )
            return IN_LOGINING
        else:
            await update.message.reply_text(
                text="Логин введен верно\nДалее введите пароль",
                reply_markup=markup
            )
            return IN_PASSWORD

    async def check_password(self, update, context):
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text="Введите пароль",
            reply_markup=markup
        )
        hashed_password = hashlib.md5(update.message.text)
        if self.cur.execute(f"""SELECT password FROM users WHERE login = {self.login}""").fetchone() == hashed_password:
            await update.message.reply_text(
                text=f"Вы вошли в систему под логином {self.login}",
            )
            self.is_guest = False
            return IN_MENU
        else:
            await update.message.reply_text(
                text="Неверный пароль, попробуйте снова"
            )
            return IN_PASSWORD

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
            entry_points=[CommandHandler('start', self.start)],
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
                    MessageHandler(filters.Regex("Log in"), self.check_login),
                    # MessageHandler(filters.Regex("My profile"), self.profile),
                    # MessageHandler(filters.Regex("Log out"), self.logout),
                    # MessageHandler(filters.Regex("Chat GPT's stories"), self.gpt),
                    MessageHandler(filters.Regex("Return"), self.back)
                ],
                TURNED_OFF: [
                    MessageHandler(filters.Regex("Start"), self.start)
                ],
                IN_LOGINING: [
                    MessageHandler(filters.TEXT, self.check_login)
                ],
                IN_PASSWORD: [
                    MessageHandler(filters.TEXT, self.check_password)
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
