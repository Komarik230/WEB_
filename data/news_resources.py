from flask_restful import abort, Resource
from . import db_session
from .news import News
from flask import jsonify


def abort_if_user_not_found(news_id):
    session = db_session.create_session()
    news = session.query(News).get(news_id)
    if not news:
        abort(404, message=f"New {news_id} not found")


class NewsResource(Resource):
    def get(self, news_id):
        abort_if_user_not_found(news_id)
        session = db_session.create_session()
        news = session.query(News).get(news_id)
        return jsonify({'news': news.to_dict(
            only=('id', 'title', 'content', 'created_date', 'user_id', 'comms'))})


class NewsListResource(Resource):
    def get(self):
        session = db_session.create_session()
        user = session.query(News).all()
        return jsonify({'news': [item.to_dict(
            only=('id', 'title', 'content', 'created_date', 'user_id', 'comms')) for item in user]})
