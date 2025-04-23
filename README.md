# Passport Photo Creator

A web application for creating passport photos that meet official requirements. This tool helps users adjust and crop their photos to exact specifications required for passports, visas, and other official documents.

## Features

- **Precise Guidance**: Visual guides showing exact positioning requirements for head size and position
- **Interactive Adjustments**: Zoom, rotate, and drag to position photos perfectly
- **Official Compliance**: Adheres to standard passport photo requirements:
  - Photo size: 35x45mm (500x653 pixels)
  - Head height: 32-36mm (445-500 pixels) from chin to crown
  - Top margin: 4-6mm (56-84 pixels)
  - Bottom margin: 7-9mm (96-124 pixels)
  - Centered face (±1.5mm)
- **Responsive Design**: Works on desktop and mobile devices
- **Direct Download**: Save properly formatted photos immediately

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/passikuva.git
   cd passikuva
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python app.py
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Usage

1. Click the "Upload Photo" button to select an image from your device
2. Use the controls to adjust the photo:
   - Rotate Left/Right: Adjust the orientation
   - Zoom In/Out: Change the size of the image
   - Ctrl + Mouse Wheel: Fine-grained zoom control
   - Click and drag: Reposition the photo
3. Position your photo so that:
   - The top of the head is between the red lines
   - The chin is between the orange lines
   - The face is centered within the vertical orange guides
4. Click "Save Photo" to download the properly formatted passport photo

![Screenshot of the Passport Photo Creator application](Screenshot%202025-04-23%20170111.png)

## Technology Stack

- **Backend**: Flask (Python)
- **Image Processing**: Pillow (PIL)
- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Styling**: CSS3

## Implementation Details

The application uses HTML5 Canvas for live photo manipulation, allowing users to interact with their photos in real-time. The Flask backend processes the final image to ensure it meets exact pixel dimensions and format requirements.

Guide lines are positioned at exact pixel measurements matching official passport photo requirements. The central canvas is precisely 500x653 pixels, matching the final output dimensions.

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*Note: This tool is designed to help create passport photos that meet common requirements. Always check the specific requirements of the issuing country or agency before submitting photos for official documents.* 