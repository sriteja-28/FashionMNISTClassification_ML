# from bck_fashionml3_env import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
from PIL import ImageOps
import cv2

app = Flask(__name__)
CORS(app)  # enabling cors for all routes

model = load_model("deep_cnn.h5")

# https://huggingface.co/Eehjie/fashion-mnist-tf-keras-model/tree/main
# model = load_model("fashion_mnist_model.h5")


labels = [
    "t-shirt/top",
    "trouser",
    "pullover",
    "dress",
    "coat",
    "sandal",
    "shirt",
    "sneaker",
    "bag",
    "ankle boot"
]

# def preprocess_image(img_bytes):
#     # open image and convert to grayscale
#     img = Image.open(io.BytesIO(img_bytes)).convert("L")

#     # improve contrast
#     img = ImageOps.equalize(img)

#     # resize with padding
#     img = ImageOps.pad(img, (28, 28))

#     # convert to numpy
#     img = np.array(img)

#     # convert to uint8 for OpenCV thresholding
#     img = img.astype("uint8")

#     # smooth edges
#     img = cv2.GaussianBlur(img, (3, 3), 0)

#     # threshold to match MNIST style
#     _, img = cv2.threshold(img, 0, 255, cv2.THRESH_OTSU)

#     # invert colors
#     img = 255 - img

#     # normalize to 0-1
#     img = img.astype("float32") / 255.0

#     # reshape for CNN
#     img = img.reshape(1, 28, 28, 1)

#     return img




def preprocess_image(img_bytes):
    # open and convert to grayscale
    img = Image.open(io.BytesIO(img_bytes)).convert("L")

    # improve contrast
    img = ImageOps.equalize(img)

    # resize with padding
    img = ImageOps.pad(img, (28, 28))

    # convert to numpy and normalize
    img = np.array(img, dtype="float32") / 255.0

    # invert colors to match MNIST
    img = 1.0 - img

    # reshape for CNN
    img = img.reshape(1, 28, 28, 1)

    return img


# def preprocess_image(img_bytes):
#     img = Image.open(io.BytesIO(img_bytes)).convert("L")
#     img = img.resize((28,28))
#     img = np.array(img).astype("float32") / 255.0
#     img = img.reshape(1, 28, 28, 1)      
#     return img

# if we are just predicting clasees without names
# @app.route("/predict", methods=["POST"])
# def predict():
#     if 'file' not in request.files:
#         return jsonify({"error": "no file"}), 400

#     file = request.files['file']
#     img = preprocess_image(file.read())

#     pred = model.predict(img)
#     label = int(np.argmax(pred, axis=1)[0])
#     return jsonify({"class": label})


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400

    file = request.files["file"]
    img = preprocess_image(file.read())
    pred = model.predict(img)
    idx = int(np.argmax(pred, axis=1)[0])

    return jsonify({
        "class_id": idx,
        "class_name": labels[idx]
    })


if __name__ == "__main__":
    app.run(debug=True)
