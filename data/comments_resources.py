from flask_restful import abort, Resource
from . import db_session
from .comments import Comments
from flask import jsonify


def abort_if_user_not_found(com_id):
    session = db_session.create_session()
    news = session.query(Comments).get(com_id)
    if not news:
        abort(404, message=f"Comment {com_id} not found")


class CommentsResource(Resource):
    def get(self, comments_id):
        abort_if_user_not_found(comments_id)
        session = db_session.create_session()
        news = session.query(Comments).get(comments_id)
        return jsonify({'comments': news.to_dict(
            only=('id', 'content', 'created_date', 'user_id'))})


class CommentsListResource(Resource):
    def get(self):
        session = db_session.create_session()
        user = session.query(Comments).all()
        return jsonify({'comments': [item.to_dict(
            only=('id', 'content', 'created_date', 'user_id')) for item in user]})
