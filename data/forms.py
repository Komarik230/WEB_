from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, EmailField, IntegerField
#from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired


class RegisterForm(FlaskForm):
    """форма регистрации"""
    login = StringField('Login', validators=[DataRequired()])
    password = PasswordField('Введи пароль', validators=[DataRequired()])
    confirm = PasswordField('Повтори', validators=[DataRequired()])
    surname = StringField('Фамлия', validators=[DataRequired()])
    name = StringField('Имя', validators=[DataRequired()])
    submit = SubmitField('Отправить')


class LoginForm(FlaskForm):
    email = EmailField('Login', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    remember_me = BooleanField('Сохранить')
    submit = SubmitField('Подписаться')