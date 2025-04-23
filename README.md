# Passport Photo Creator
If you find this useful consider [![Buy me a coffee](https://storage.ko-fi.com/cdn/useruploads/a558000e-d26e-4f61-ad83-153e48aac7b4_65373672-3cb1-4b02-b5cc-989573f6284a.png)](https://ko-fi.com/rakoivun)


![Screenshot of the Passport Photo Creator application](Screenshot%202025-04-23%20170111.png)


A web application for creating passport photos that meet official requirements. This tool helps users adjust and crop their photos to exact specifications required for passports, visas, and other official documents.

## High level process
- Take a photo [(more on it below)](#detailed-process)
- Use this tool to ensure that it's of correct size & person is at right position
 * Online version MIGHT be operational here https://passikuva.onrender.com/ . I am not storing the images on the server (trust me?). There might be delay of 1 minute in the startup as this is free tier.
- Upload the tool to Finnish police db

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

## Detailed process

- Take a photo 
  - Good approach is to use natural light (not direct)
  - Put the subject some 1-1.5 meters from a white wall to avoid shadows
  - Step back some 2-3 meters to avoid distortion of the small mobile phone lens. Here subject standing on a sofa and I have zoomed in a bit with my mobile phone.
  - It's sufficient that the "right behind the head" part is flatly illuminated. There is slight shadow on the left but I think it is ok.
  - No kittens where harmed!
![Raw Passport Photo](raw_passport.png)
  - Instructions on what kind of photo is acceptable from Finnish police: https://lupakuvienvastaanotto.fi/FaceImageHelp/Photography.aspx



- Upload the photo to police database: 
  - Sign in as a private person: https://lupakuvienvastaanotto.fi/Login/Login.aspx
    - Register as a private person if not registered yet
  - Upload the processed image by following the instructions: https://lupakuvienvastaanotto.fi/NewPhoto/AddNewPhotoView.aspx
    - You will be given guidance on what is acceptable, etc. Check carefully
    - At the end, you will get a code like "ACD UKL ZK8" 
      - This is the code you will need when applying for ID or passport - so keep it safe
      - Note that there is a BUG or discrepancy that the real code is without spaces, i.e., "ACD UKL ZK8" -> "ACDUKLZK8" when applying for a passport at lupakuvien vastaanotto

- Apply for a passport or ID here: 
  - https://asiointi.poliisi.fi/yksityis/hekopassi

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