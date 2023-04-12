import smtplib
import random


def send(email, username):
    smtpObj = smtplib.SMTP('smtp.mail.ru', 587)
    smtpObj.starttls()
    smtpObj.login('web_yl2023@mail.ru', 'R2vnsbnJwULPV3BXjNun')
    pswrd = generate()
    smtpObj.sendmail("web_yl2023@mail.ru", email, f"""That is your password for user {username}
{pswrd}""")
    smtpObj.quit()
    return pswrd


def generate():
    symb = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o',
            'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k',
            'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q',
            'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
            'Z', 'X', 'C', 'V', 'B', 'N', 'M', '@', '#']
    sampling = random.choices(symb, k=random.randint(8, 11))
    return ''.join(sampling)


send('laptevegor666@gmail.com', 'Egor')
