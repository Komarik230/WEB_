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

TURNED_OFF, STARTED, IN_MENU, GET_LOGIN, GET_PSWD, CHECK_LOGIN, CHECK_PSWD, GET_EMAIL, CHECK_EMAIL, GET_USNM, CHECK_USNM, GET_OTHER, CHECK_OTHER, END_REG = range(
    14)

logger = logging.getLogger(__name__)
load_dotenv()
token = os.getenv('token')


class User:
    def __init__(self):
        self.user_id = None
        self.is_guest = True
        self.is_authorized = 0
        self.keyboard_pos = 0
        self.current = 0
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
        self.keyboard_pos = 1
        self.reply_keyboard = self.keyboards[self.keyboard_pos]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=False)
        await update.message.reply_text(
            text='Hello',
            reply_markup=markup
        )
        return STARTED

    async def stop(self, update, context):
        self.keyboard_pos = 0
        self.reply_keyboard = self.keyboards[self.keyboard_pos]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text="Всего доброго!",
            reply_markup=markup
        )
        return TURNED_OFF

    async def back(self, update, context):
        self.keyboard_pos -= 1
        if self.keyboard_pos != 2:
            self.reply_keyboard = self.keyboards[self.keyboard_pos]
        else:
            i = bool(not self.is_guest)
            self.reply_keyboard = self.keyboards[self.keyboard_pos][i]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(text='adadad',
                                        reply_markup=markup)
        return self.keyboard_pos

    async def menu(self, update, context):
        self.keyboard_pos = 2
        if self.is_guest:
            self.reply_keyboard = self.keyboards[self.keyboard_pos][0]
        else:
            self.reply_keyboard = self.keyboards[self.keyboard_pos][1]
        markup = ReplyKeyboardMarkup(self.reply_keyboard, one_time_keyboard=True)
        await update.message.reply_text(
            text='that you may do',
            reply_markup=markup
        )
        return IN_MENU

    async def entering_login(self, update, context):
        self.keyboard_pos = 3
        await update.message.reply_text(
            text="Введите логин",
        )
        print(1)
        return CHECK_LOGIN

    async def check_login(self, update, context):
        markup1 = ReplyKeyboardMarkup([['Try again'], ['Return']], one_time_keyboard=True)
        markup2 = ReplyKeyboardMarkup([['Next'], ['Return']], one_time_keyboard=True)
        self.username = update.message.text
        self.user_id = self.cur.execute(f"SELECT user_id FROM users WHERE username = '{self.username}'").fetchone()
        if self.user_id is None:
            await update.message.reply_text(
                text="Аккаунта не существует",
                reply_markup=markup1
            )
            return GET_LOGIN
        else:
            await update.message.reply_text(
                text="Логин введен верно",
                reply_markup=markup2
            )
            return GET_PSWD

    async def entering_password(self, update, context):
        await update.message.reply_text(
            text="Введите пароль",
        )
        return CHECK_PSWD

    async def check_password(self, update, context):
        markup1 = ReplyKeyboardMarkup([['Come back to menu']], one_time_keyboard=True)
        markup2 = ReplyKeyboardMarkup([['Try again'], ['Return']], one_time_keyboard=True)
        pswd = update.message.text
        hashed_password = hashlib.md5(pswd.encode('utf-8'))
        if self.cur.execute(
                """SELECT hashed_password FROM users WHERE user_id = ?""", self.user_id).fetchone()[
            0] == hashed_password.hexdigest():
            await update.message.reply_text(
                text=f"Вы вошли в систему под логином {self.username}",
                reply_markup=markup1
            )
            self.cur.execute(f"""UPDATE users
                                        SET is_authorized_tel = 1
                                        WHERE user_id = ?""", self.user_id)
            self.is_guest = False
            self.keyboard_pos = 0
            return TURNED_OFF
        else:
            await update.message.reply_text(
                text="Неверный пароль, попробуйте снова",
                reply_markup=markup2
            )
            return GET_PSWD

    async def logout(self, update, context):
        markup = ReplyKeyboardMarkup([['Come back to menu']], one_time_keyboard=True)
        self.is_guest = True
        print(self.cur.execute("""SELECT is_authorized_tel FROM users WHERE user_id = ?""", self.user_id).fetchone()[0])
        self.cur.execute(f"""UPDATE users
                            SET is_authorized_tel = 0
                            WHERE user_id = ?""", self.user_id)
        print(self.cur.execute("""SELECT is_authorized_tel FROM users WHERE user_id = ?""", self.user_id).fetchone()[0])
        await update.message.reply_text(text='Вы успешно вышли из аккаунта', reply_markup=markup)
        return TURNED_OFF

    async def enter_email(self, update, context):
        await update.message.reply_text(
            text="Введите почту, для которой хотите создать аккаунт"
        )
        return CHECK_EMAIL

    async def check_email(self, update, context):
        markup1 = ReplyKeyboardMarkup([['Enter again'], ['Back']], one_time_keyboard=True)
        markup2 = ReplyKeyboardMarkup([['Next'], ['Back']], one_time_keyboard=True)
        self.email = update.message.text
        self.user_id = self.cur.execute(f"SELECT user_id FROM users WHERE email = '{self.email}'").fetchone()
        if self.user_id is not None:
            await update.message.reply_text(
                text="Аккаунт уже существует",
                reply_markup=markup1
            )
            return GET_EMAIL
        else:
            await update.message.reply_text(
                text="Аккаунт еще не существует, дальше?",
                reply_markup=markup2
            )
            return GET_USNM

    async def enter_usnm(self, update, context):
        await update.message.reply_text(
            text="Введите имя пользователя"
        )
        return CHECK_USNM

    async def check_usnm(self, update, context):
        markup1 = ReplyKeyboardMarkup([['Enter again'], ['Back']], one_time_keyboard=True)
        markup2 = ReplyKeyboardMarkup([['Next']], one_time_keyboard=True)
        self.username = update.message.text
        self.user_id = self.cur.execute(f"SELECT user_id FROM users WHERE username = '{self.username}'").fetchone()
        if self.user_id is not None:
            await update.message.reply_text(
                text="Имя пользователя занято",
                reply_markup=markup1
            )
            return GET_USNM
        else:
            await update.message.reply_text(
                text="Имя пользователя свободно",
                reply_markup=markup2
            )
            return GET_OTHER

    async def other_info(self, update, context):
        await update.message.reply_text(
            text="Введите через пробел ваше имя, фамилию и возраст"
        )
        return CHECK_OTHER

    async def check_other_info(self, update, context):
        markup1 = ReplyKeyboardMarkup([['Enter again'], ['Back']], one_time_keyboard=True)
        markup2 = ReplyKeyboardMarkup([['Create profile'], ['Back']], one_time_keyboard=True)
        text = update.message.text.split(' ')
        if len(text) != 3:
            await update.message.reply_text(
                text="Введенные данные неполны",
                reply_markup=markup1
            )
            return GET_OTHER
        self.name, self.surname, self.age = text[0], text[1], text[2]
        await update.message.reply_text(
            text=f"""Вот данные вашего аккаунта:
                    username: {self.username}
                    email: {self.email}
                    name: {self.name}
                    surname: {self.surname}
                    age: {self.age}""",
            reply_markup=markup2
        )
        return END_REG

    async def end_reg(self, update, context):
        hashed_password =
        self.cur.execute(f"INSERT INTO users(email, username, name, surname, age, hashed_password) VALUES('{self.email}', '{self.username}', '{self.name}', '{self.surname}', {self.age}, '{hashed_password}')")
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
                    MessageHandler(filters.Regex("Log in"), self.entering_login),
                    # MessageHandler(filters.Regex("My profile"), self.profile),
                    MessageHandler(filters.Regex("Log out"), self.logout),
                    # MessageHandler(filters.Regex("Chat GPT's stories"), self.gpt),
                    MessageHandler(filters.Regex("Return"), self.back)
                ],
                TURNED_OFF: [
                    MessageHandler(filters.Regex("Start"), self.start),
                    MessageHandler(filters.Regex("Come back to menu"), self.menu),
                    MessageHandler(filters.Regex("Вы успешно вышли из аккаунта"), self.menu)
                ],
                GET_LOGIN: [
                    MessageHandler(filters.Regex("Try again"), self.entering_login),
                    MessageHandler(filters.Regex("Return"), self.back)
                ],
                CHECK_LOGIN: [
                    MessageHandler(filters.TEXT, self.check_login),
                ],
                GET_PSWD: [
                    MessageHandler(filters.Regex("Next"), self.entering_password),
                    MessageHandler(filters.Regex("Try again"), self.entering_password),
                    MessageHandler(filters.Regex("Return"), self.back)
                ],
                CHECK_PSWD: [
                    MessageHandler(filters.TEXT, self.check_password),
                ],
                GET_EMAIL: [
                    MessageHandler(filters.TEXT, self.enter_email),
                    MessageHandler(filters.Regex("Back"), self.back),
                    MessageHandler(filters.Regex("Enter again"), self.enter_email)
                ],
                CHECK_EMAIL: [
                    MessageHandler(filters.TEXT, self.check_email)
                ],
                GET_USNM: [
                    MessageHandler(filters.TEXT, self.enter_usnm),
                    MessageHandler(filters.Regex("Back"), self.back),
                    MessageHandler(filters.Regex("Enter again"), self.enter_usnm)
                ],
                GET_OTHER: [
                    MessageHandler(filters.Regex("Next"), self.other_info),
                    MessageHandler(filters.Regex("Enter again"), self.other_info),
                    MessageHandler(filters.Regex("Введенные данные неполны"), self.other_info)
                ],
                CHECK_OTHER: [
                    MessageHandler(filters.TEXT, self.check_other_info)
                ],
                END_REG: [
                    MessageHandler(filters.Regex("Create profile"), self.end_reg),
                    MessageHandler(filters.Regex("Back"), self.back)
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
