from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, IntegerField
from wtforms.validators import DataRequired
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email



class RegisterForm(FlaskForm):
    """форма регистрации"""
    login = StringField('Login', validators=[DataRequired()])
    password = PasswordField('Введи пароль', validators=[DataRequired()])
    confirm = PasswordField('Повтори', validators=[DataRequired()])
    surname = StringField('Твоя фамилия', validators=[DataRequired()])
    name = StringField('Твое имя', validators=[DataRequired()])
    submit = SubmitField('Отправить')


class LoginForm(FlaskForm):
    email = EmailField('Login', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    remember_me = BooleanField('Сохранить данные')
    submit = SubmitField('Подписаться')