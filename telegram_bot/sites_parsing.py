from bs4 import BeautifulSoup
from lxml import html
import requests


url = 'https://bugaga.ru/pozdravlenya/thisday/1146720949-chto-ne-den-to-prazdnik.html' # url для второй страницы
r = requests.get(url)
with open('test.html', 'w') as output_file:
  output_file.write(str(r.text))

with open('test.html', 'r') as file:
  lines = file.readlines()
print(''.join(lines))
# soup = BeautifulSoup(text)
# film_list = soup.find('div', {'class': 'profileFilmsList'})
