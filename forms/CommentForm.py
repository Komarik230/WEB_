from flask_wtf import FlaskForm
from wtforms import TextAreaField, SubmitField
from wtforms.validators import DataRequired


class ComForm(FlaskForm):
    content = TextAreaField('Что вы хотели сказать?', validators=[DataRequired()])
    submit = SubmitField('Оставить комментарий')
