from flask_restful import abort, Resource
from . import db_session
from .users import User
from flask import jsonify


def abort_if_user_not_found(user_id):
    session = db_session.create_session()
    news = session.query(User).get(user_id)
    if not news:
        abort(404, message=f"User {user_id} not found")


class UsersResource(Resource):
    def get(self, users_id):
        abort_if_user_not_found(users_id)
        session = db_session.create_session()
        news = session.query(User).get(users_id)
        return jsonify({'user': news.to_dict(
            only=('id', 'name', 'surname', 'nickname', 'age', 'status', 'about', 'email',
                  'modified_date', 'city_from'))})


class UsersListResource(Resource):
    def get(self):
        session = db_session.create_session()
        user = session.query(User).all()
        return jsonify({'users': [item.to_dict(
            only=('id', 'name', 'surname', 'nickname', 'age', 'status', 'about', 'email',
                  'modified_date', 'city_from')) for item in user]})
