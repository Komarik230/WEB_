import os
import openai

openai.api_key = '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'


def gen_st(request):
    completion1 = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"{request}"}
        ]
    )
    text = str(completion1.choices[0].message.content).replace('\n', ' ')
    completion2 = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"Translate to Russian this text: {text}"}
        ]
    )

    return completion2.choices[0].message.content
