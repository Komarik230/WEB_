from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, TextAreaField, SubmitField, IntegerField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired


class OfficeForm(FlaskForm):
    name = StringField('Имя', validators=[DataRequired()])
    submit = SubmitField('Сохранить')
    surname = StringField('Фамилия')
    nickname = StringField('Никнейм')
    age = StringField('Возраст')
    status = StringField('Статус')
    about = TextAreaField('Немного обо мне')
    email = StringField('Email')
    hashed_password = PasswordField('Пароль')
    city_from = StringField('Город')
