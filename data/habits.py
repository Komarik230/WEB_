import sqlalchemy
from flask_login import UserMixin
from .db_session import SqlAlchemyBase
from sqlalchemy import orm


class Habits(SqlAlchemyBase, UserMixin):
    __tablename__ = 'habits'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    type = sqlalchemy.Column(sqlalchemy.String)
    period = sqlalchemy.Column(sqlalchemy.Integer)  # days
    about_link = sqlalchemy.Column(sqlalchemy.String)
    count = sqlalchemy.Column(sqlalchemy.Integer, default=0)
    reposts = sqlalchemy.Column(sqlalchemy.Integer, default=0)
    creator = sqlalchemy.Column(sqlalchemy.String, sqlalchemy.ForeignKey("users.id"))
    user = orm.relation('User')
