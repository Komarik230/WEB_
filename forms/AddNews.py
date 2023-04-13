from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired


class AddNewsForm(FlaskForm):
    news_name = StringField('Заголовок новости', validators=[DataRequired()])
    news_content = StringField('Содержание новости', validators=[DataRequired()])
    submit = SubmitField('Опубликовать')