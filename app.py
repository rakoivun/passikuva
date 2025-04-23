# ────────────────────────── passport_photo_server.py ─────────────────────────
"""
Flask micro‑service that produces EU/ICAO‑size passport photos
(36 mm × 47 mm @ 351.5 ppi) from arbitrary uploads – **without any heavy
CV dependencies**. The server constrains only the *outer* canvas size and
resolution; biometric‑grid correctness is left to the client‑side SVG overlay
and live validation JavaScript.

External runtime deps
---------------------
    pip install flask pillow numpy werkzeug

Add whatever front‑end you prefer (React/Vue/vanilla) that renders the
official grid, locks sliders until users respect the margins, and then sends
`{filename, scale, position, rotation}` in JSON to `/process`.
"""

from __future__ import annotations

import base64
import io
import logging
import os
import re
import uuid
from pathlib import Path
from io import BytesIO

from flask import Flask, jsonify, render_template, request, send_file
from PIL import Image, ImageOps
from werkzeug.utils import secure_filename

# ────────────────────────── CONFIGURATION ────────────────────────────────────
ROOT = Path(__file__).resolve().parent
UPLOADS = ROOT / "uploads"
UPLOADS.mkdir(exist_ok=True)

MAX_FILE_MB = 16

# Canvas in pixels (36 × 47 mm)
PASSPORT_W, PASSPORT_H = 500, 653
PPI = 351.5

app = Flask(__name__)
app.config.update(
    MAX_CONTENT_LENGTH=MAX_FILE_MB * 1024 * 1024,
    UPLOAD_FOLDER=str(UPLOADS),
    SECRET_KEY="change‑me‑in‑prod",
)

# ────────────────────────── HELPERS ─────────────────────────────────────────-

def allowed_file(fname: str) -> bool:
    return "." in fname and fname.rsplit(".", 1)[1].lower() in {"jpg", "jpeg", "png"}

# ────────────────────────── ROUTES ───────────────────────────────────────────

@app.route("/")
def index():  # placeholder demo template (not included here)
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    f = request.files.get("file")
    if not f or f.filename == "":
        return jsonify({"error": "no file"}), 400
    if not allowed_file(f.filename):
        return jsonify({"error": "bad type"}), 400

    img = Image.open(f.stream)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    fname = f"{uuid.uuid4()}{os.path.splitext(secure_filename(f.filename))[1]}"
    path = Path(app.config["UPLOAD_FOLDER"]) / fname
    img.save(path)

    preview = ImageOps.exif_transpose(img.copy())
    preview.thumbnail((800, 800))
    if preview.mode == "L":
        preview = preview.convert("RGB")

    buf = io.BytesIO()
    preview.save(buf, format="JPEG")
    b64 = base64.b64encode(buf.getvalue()).decode()

    return jsonify({
        "success": True,
        "filename": fname,
        "image": f"data:image/jpeg;base64,{b64}",
    })


@app.route("/process", methods=["POST"])
def process_image():
    try:
        # Get image data from request
        data = request.json
        image_data = data.get('imageData')
        width = data.get('width', 500)
        height = data.get('height', 653)
        
        # Extract the base64 encoded image
        image_data = re.sub('^data:image/.+;base64,', '', image_data)
        image_bytes = base64.b64decode(image_data)
        
        # Open the image with PIL
        img = Image.open(BytesIO(image_bytes))
        
        # Frontend now sends pre-cropped data, so padding is no longer needed.
        # We might still resize slightly to ensure exact dimensions, just in case.
        # img = ImageOps.pad(img, (width, height), method=Image.Resampling.LANCZOS, color='white')
        if img.size != (width, height):
             print(f"Warning: Received image size {img.size} differs from target ({width}, {height}). Resizing.")
             img = img.resize((width, height), Image.Resampling.LANCZOS)

        # Convert to RGB if needed (e.g., if input PNG had alpha)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save to BytesIO object
        output = BytesIO()
        img.save(output, format='JPEG', quality=95)
        output.seek(0)
        
        return send_file(output, mimetype='image/jpeg', as_attachment=True, download_name='passport_photo.jpg')
    
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ────────────────────────── MAIN ─────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(levelname)s:%(name)s:%(message)s")
    app.run(host="0.0.0.0", port=8000, debug=True)
