from flask import Flask, render_template

app = Flask(__name__)


@app.route('/calendar')
def calendar():
    return render_template('calendar.html')


if __name__ == '__main__':
    app.run(port=8080, host='127.0.0.1')
