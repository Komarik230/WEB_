from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    with open("static/txt/about.txt", "r", encoding="utf-8") as about:
        data_about = about.read()
    return render_template("main.html", about=data_about)


@app.route('/calendar')
def calendar():
    return render_template('calendar.html')


def main():
    app.run()


if __name__ == '__main__':
    main()
