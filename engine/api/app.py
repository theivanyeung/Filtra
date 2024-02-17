import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import json
import requests
from transformers import ViltProcessor, ViltForQuestionAnswering
from PIL import Image
import io
import base64
import sys

# Prompts
sys.path.append("..")
from components.prompts import text_analyze_prompt

app = Flask(__name__)
CORS(app)

# Tranformer Models
processor = ViltProcessor.from_pretrained("dandelin/vilt-b32-finetuned-vqa")
model = ViltForQuestionAnswering.from_pretrained("dandelin/vilt-b32-finetuned-vqa")

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

    return jsonify({"response": "SHITTTT"})


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
                "content": "You are Vesper, an assistant focused on minimizing digital distractions by filtering out distractions within apps/websites instead of blocking them entirely, providing a personalized, adaptive, and productive digital experience and helping users maintain their focus",
            },
            {"role": "user", "content": text_analyze_prompt + prompt},
        ],
    )

    return jsonify({"response": response.choices[0].message.content})


@app.route("/engine/image", methods=["POST"])
def image_classifier():
    image_url = request.json.get("content")
    isbase = request.json.get("isbase")

    if not image_url:
        return jsonify({"error": "No image URL uploaded"}), 400

    if isbase:
        # Decode the base64 data to get the image data
        decoded_data = base64.b64decode(image_url)

        # Convert the image data to an Image object
        image = Image.open(io.BytesIO(decoded_data))
    else:
        image = Image.open(requests.get(image_url, stream=True).raw)

    image = image.convert("RGB")

    text = "Is this image so extremely distracting that the viewer will become addicted to it?"

    encoding = processor(image, text, return_tensors="pt")

    outputs = model(**encoding)
    logits = outputs.logits
    idx = logits.argmax(-1).item()

    return jsonify({"response": model.config.id2label[idx]})


@app.route("/engine/videos", methods=["POST"])
def video_classifier():
    video = request.json.get("video")

    pass


# Agent

openai.api_key = os.getenv("OPENAI_API_KEY")


@app.route("/entity", methods=["POST"])
def entity():
    data = request.json.get("data")

    if not data:
        return jsonify({"error": "Data not provided"}), 400

    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {"role": "system", "content": "You are Vesper, an assistant focused on minimizing digital distractions by filtering out distractions within apps/websites instead of blocking them entirely, providing a personalized, adaptive, and productive digital experience and helping users maintain their focus"},
    #         {"role": "user", "content": prompt},
    #     ]
    # )

    # return jsonify({"response": response.choices[0].message.content})

    return jsonify({"data": data})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
