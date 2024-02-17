import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import json
import requests

app = Flask(__name__)
CORS(app)

# Flask


@app.errorhandler(500)
def handle_internal_server_error(error):
    return (
        jsonify(
            {
                "error": "Internal Server Error",
                "details": str(error),
                "trace": traceback.format_exc(),
            }
        ),
        500,
    )


@app.route("/")
def home():
    return "If humanity successfully builds AGI, how the hell are we gonna control it? In the meantime, I'm building this with the end goal of eventually helping me do shit while I'm operating my digital world. Starting out with an AI specializing in distraction management."


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


# Engine


def prompt_refinery(prompt):
    pass


def response_refinery(response):
    pass


@app.route("/engine", methods=["POST"])
def engine():
    content = request.json.get("content")

    if not content:
        return jsonify({"error": "No text uploaded"}), 400

    print(json.dumps(content, indent=3))

    return jsonify({"response": "something wrong happened"})


@app.route("/engine/text", methods=["POST"])
def text_classifier():
    prompt = request.json.get("content")

    if not prompt:
        return jsonify({"error": "No text uploaded"}), 400

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are Filtra, an assistant focused on minimizing digital distractions by filtering out distractions within apps/websites instead of blocking them entirely, providing a personalized, adaptive, and productive digital experience and helping users maintain their focus",
            },
            {"role": "user", "content": text_analyze_prompt + prompt},
        ],
    )

    return jsonify({"response": response.choices[0].message.content})
