import os
import logging
from telegram.ext import Application, MessageHandler, filters, CommandHandler, ConversationHandler, CallbackQueryHandler
from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from dotenv import load_dotenv
import sqlite3
import hashlib
import pswrd_generator
from data import db_session
from data import users

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.DEBUG
)

TURNED_OFF, STARTED, IN_MENU, GET_LOGIN, GET_PSWD, CHECK_LOGIN, CHECK_PSWD, GET_EMAIL, CHECK_EMAIL, GET_USNM, CHECK_USNM, GET_OTHER, CHECK_OTHER, MAKING_PSWRD, END_REG, SEE_PSWRD = range(
    16)

logger = logging.getLogger(__name__)
load_dotenv()
token = os.getenv('token')


class Bot:
    def __init__(self):
        self.user_id = None
        self.is_guest = True
        self.is_authorized = 0
        self.keyboard_pos = 0
        self.current = 0
        self.keyboards = [
            [['Start']],
            [['Menu', 'Turn Off']],
            ([['Registration', 'Log in'], ["Chat GPT's stories", 'Back']],
             [['My profile', 'Log out'], ["Chat GPT's stories", 'Back']]),
            [['Back']]
        ]
        # session = db_session.create_session()
        # questions = session.query(users.User).filter(
        #     users.User.id == 1,
        # ).all()
        # print(questions)

    async def start(self, update, context):
        print(1)
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
        self.con.close()
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
        self.con = sqlite3.connect("../db/habits.db")
        self.cur = self.con.cursor()
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
        markup1 = ReplyKeyboardMarkup([['Try again'], ['Back']], one_time_keyboard=True)
        markup2 = ReplyKeyboardMarkup([['Next'], ['Back']], one_time_keyboard=True)
        self.username = update.message.text
        self.user_id = self.cur.execute(f"SELECT id FROM users WHERE nickname = '{self.username}'").fetchone()
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
        markup2 = ReplyKeyboardMarkup([['Try again'], ['Back']], one_time_keyboard=True)
        pswd = update.message.text
        hashed_password = hashlib.md5(pswd.encode('utf-8'))
        if self.cur.execute(
                """SELECT hashed_password FROM users WHERE id = ?""", self.user_id).fetchone()[
            0] == hashed_password.hexdigest():
            await update.message.reply_text(
                text=f"Вы вошли в систему под логином {self.username}",
                reply_markup=markup1
            )
            self.cur.execute(f"""UPDATE users
                                        SET is_authorized_tel = 1
                                        WHERE id = ?""", self.user_id)
            self.is_guest = False
            self.keyboard_pos = 0
            self.con.close()
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
                            WHERE id = ?""", self.user_id)
        print(self.cur.execute("""SELECT is_authorized_tel FROM users WHERE id = ?""", self.user_id).fetchone()[0])
        await update.message.reply_text(text='Вы успешно вышли из аккаунта', reply_markup=markup)
        self.con.close()
        return TURNED_OFF

    async def enter_email(self, update, context):
        self.keyboard_pos = 3
        await update.message.reply_text(
            text="Введите почту, для которой хотите создать аккаунт"
        )
        return CHECK_EMAIL

    async def check_email(self, update, context):
        markup1 = ReplyKeyboardMarkup([['Enter again'], ['Back']], one_time_keyboard=True)
        markup2 = ReplyKeyboardMarkup([['Next'], ['Back']], one_time_keyboard=True)
        self.email = update.message.text
        self.user_id = self.cur.execute(f"SELECT id FROM users WHERE email = '{self.email}'").fetchone()
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
        self.user_id = self.cur.execute(f"SELECT id FROM users WHERE nickname = '{self.username}'").fetchone()
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
        markup2 = ReplyKeyboardMarkup([['Make password'], ['Generate password', 'Back']], one_time_keyboard=True)
        text = update.message.text.split(' ')
        if len(text) != 3:
            await update.message.reply_text(
                text="Введенные данные неполны",
                reply_markup=markup1
            )
            return GET_OTHER
        else:
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
            return MAKING_PSWRD

    async def generate(self, update, context):
        markup = ReplyKeyboardMarkup([['Create Account'], ['Back']], one_time_keyboard=True)
        self.password = pswrd_generator.send(self.email, self.username)
        await update.message.reply_text(
            text=f"Пароль был отправлен на почту {self.email}",
            reply_markup=markup
        )
        return END_REG

    async def ask_pswrd(self, update, context):
        await update.message.reply_text(
            text=f"Введите пароль"
        )
        return SEE_PSWRD

    async def make_pswrd(self, update, context):
        self.password = update.message.text
        markup = ReplyKeyboardMarkup([['Create Account'], ['Back']], one_time_keyboard=True)
        await update.message.reply_text(
            text=f"Вы ввели пароль:  {self.password}",
            reply_markup=markup
        )
        return END_REG

    async def end_reg(self, update, context):
        markup2 = ReplyKeyboardMarkup([['Come back to menu']], one_time_keyboard=True)
        markup1 = ReplyKeyboardMarkup([['Try again'], ['Back']], one_time_keyboard=True)
        hashed_password = hashlib.md5(self.password.encode('utf-8')).hexdigest()
        self.cur.execute(
            f"INSERT INTO users(email, nickname, name, surname, age, hashed_password, is_authorized_tel) VALUES('{self.email}', '{self.username}', '{self.name}', '{self.surname}', {self.age}, '{hashed_password}', '1')")
        if self.cur.execute(f"SELECT id FROM users WHERE email = '{self.email}'").fetchone() is None:
            await update.message.reply_text(
                text="Ошибка создания аккаунта",
                reply_markup=markup1
            )
            return GET_USNM
        else:
            await update.message.reply_text(
                text="Аккаунт успешно создан",
                reply_markup=markup2
            )
            self.keyboard_pos = 0
            self.con.close()
            return TURNED_OFF

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
                    MessageHandler(filters.Regex("Registration"), self.enter_email),
                    MessageHandler(filters.Regex("Log in"), self.entering_login),
                    # MessageHandler(filters.Regex("My profile"), self.profile),
                    MessageHandler(filters.Regex("Log out"), self.logout),
                    # MessageHandler(filters.Regex("Chat GPT's stories"), self.gpt),
                    MessageHandler(filters.Regex("Back"), self.back)
                ],
                TURNED_OFF: [
                    MessageHandler(filters.Regex("Start"), self.start),
                    MessageHandler(filters.Regex("Come back to menu"), self.menu),
                    MessageHandler(filters.Regex("Вы успешно вышли из аккаунта"), self.menu)
                ],
                GET_LOGIN: [
                    MessageHandler(filters.Regex("Try again"), self.entering_login),
                    MessageHandler(filters.Regex("Back"), self.back)
                ],
                CHECK_LOGIN: [
                    MessageHandler(filters.TEXT, self.check_login),
                ],
                GET_PSWD: [
                    MessageHandler(filters.Regex("Next"), self.entering_password),
                    MessageHandler(filters.Regex("Try again"), self.entering_password),
                    MessageHandler(filters.Regex("Back"), self.back)
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
                    MessageHandler(filters.Regex("Next"), self.enter_usnm),
                    MessageHandler(filters.Regex("Back"), self.back),
                    MessageHandler(filters.Regex("Enter again"), self.enter_usnm)
                ],
                CHECK_USNM: [
                    MessageHandler(filters.TEXT, self.check_usnm)
                ],
                GET_OTHER: [
                    MessageHandler(filters.Regex("Next"), self.other_info),
                    MessageHandler(filters.Regex("Enter again"), self.other_info),
                    MessageHandler(filters.Regex("Back"), self.back)
                ],
                CHECK_OTHER: [
                    MessageHandler(filters.TEXT, self.check_other_info)
                ],
                END_REG: [
                    MessageHandler(filters.Regex("Back"), self.back),
                    MessageHandler(filters.Regex("Create Account"), self.end_reg),
                ],
                MAKING_PSWRD: [
                    MessageHandler(filters.Regex("Back"), self.back),
                    MessageHandler(filters.Regex("Make password"), self.ask_pswrd),
                    MessageHandler(filters.Regex('Generate password'), self.generate)
                ],
                SEE_PSWRD: [
                    MessageHandler(filters.TEXT, self.make_pswrd),
                ]
            },
            # точка выхода из разговора
            fallbacks=[CommandHandler('start', self.start)]
        )
        application.add_handler(conv_handler)
        application.run_polling()


# Запускаем функцию main() в случае запуска скрипта.
if __name__ == '__main__':
    us1 = Bot()
    us1.main()
