// DOM Elements
const photoCanvas = document.getElementById('photoCanvas');
const ctx = photoCanvas.getContext('2d');
const uploadBtn = document.getElementById('uploadBtn');
const saveBtn = document.getElementById('saveBtn');
const rotateLeftBtn = document.getElementById('rotateLeftBtn');
const rotateRightBtn = document.getElementById('rotateRightBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetBtn = document.getElementById('resetBtn');

// App state
const state = {
    image: null,
    zoom: 1,
    rotation: 0,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0
};

// Initialize canvas
function initCanvas() {
    // Set the canvas to the exact passport photo dimensions
    photoCanvas.width = 500; // Exact passport photo width
    photoCanvas.height = 653; // Exact passport photo height
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, photoCanvas.width, photoCanvas.height);
    
    // Draw initial placeholder text
    ctx.fillStyle = '#cccccc';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Upload a photo to begin', photoCanvas.width / 2, photoCanvas.height / 2);
    
    // Set button states
    updateUI();
}

// Update UI based on current state
function updateUI() {
    const hasImage = !!state.image;
    
    saveBtn.disabled = !hasImage;
    rotateLeftBtn.disabled = !hasImage;
    rotateRightBtn.disabled = !hasImage;
    zoomInBtn.disabled = !hasImage;
    zoomOutBtn.disabled = !hasImage;
    resetBtn.disabled = !hasImage;
}

// Load an image from file
function loadImage(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        
        img.onload = function() {
            state.image = img;
            state.zoom = 1;
            state.rotation = 0;
            state.panX = 0;
            state.panY = 0;
            
            // Center the image
            centerImage();
            
            // Draw the image
            drawImage();
            
            // Update UI
            updateUI();
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// Center the image within the canvas
function centerImage() {
    if (!state.image) return;
    
    // Center means zero offset from the canvas center
    state.panX = 0;
    state.panY = 0;
}

// Draw the image with current transformation
function drawImage() {
    if (!state.image) return;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, photoCanvas.width, photoCanvas.height);
    
    // Save context state
    ctx.save();
    
    // Move origin to the center of the canvas
    ctx.translate(photoCanvas.width / 2, photoCanvas.height / 2);
    
    // Rotate around the center
    ctx.rotate(state.rotation * Math.PI / 180);
    
    // Apply zoom around the center
    ctx.scale(state.zoom, state.zoom);
    
    // Draw the image centered around the (now scaled) origin, then apply pan
    // Pan now represents the offset from the center
    ctx.drawImage(state.image,
                  -state.image.width / 2 + state.panX,
                  -state.image.height / 2 + state.panY);
    
    // Restore context state
    ctx.restore();
}

// Rotate image left
function rotateLeft() {
    state.rotation = (state.rotation - 90) % 360;
    drawImage();
}

// Rotate image right
function rotateRight() {
    state.rotation = (state.rotation + 90) % 360;
    drawImage();
}

// --- Zoom Functions for Buttons ---
// Zoom in
function zoomIn() {
    if (state.zoom < 3) {
        state.zoom *= 1.05; // 5% step for buttons
        drawImage();
    }
}

// Zoom out
function zoomOut() {
    if (state.zoom > 0.1) {
        state.zoom /= 1.05; // 5% step for buttons
        drawImage();
    }
}

// --- Zoom Functions for Scroll Wheel (More Fine-Grained) ---
function zoomInScroll() {
    if (state.zoom < 3) {
        state.zoom *= 1.025; // 2.5% step for scroll
        drawImage();
    }
}

function zoomOutScroll() {
    if (state.zoom > 0.1) {
        state.zoom /= 1.025; // 2.5% step for scroll
        drawImage();
    }
}

// Reset transformations
function resetTransformation() {
    state.zoom = 1;
    state.rotation = 0;
    centerImage();
    drawImage();
}

// Save image
function saveImage() {
    if (!state.image) return;

    // No need for temporary canvas - our main canvas is already the correct size
    // Send the entire canvas directly
    const imageData = photoCanvas.toDataURL('image/png');

    // Send data to the backend for processing
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            imageData: imageData,
            width: photoCanvas.width,
            height: photoCanvas.height
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(err => { 
                throw new Error(err.error || 'Unknown processing error'); 
            });
        } else {
            return response.blob();
        }
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'passport-photo.jpg';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error saving photo:', error);
        alert(`Failed to save photo: ${error.message}`);
    });
}

// Handle file upload
function handleFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        if (e.target.files && e.target.files[0]) {
            loadImage(e.target.files[0]);
        }
    };
    
    input.click();
}

// Mouse events for panning
function handleMouseDown(e) {
    if (!state.image) return;
    
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    photoCanvas.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (!state.isDragging) return;
    
    // dx, dy are canvas pixel movements
    const dx = e.clientX - state.dragStartX;
    const dy = e.clientY - state.dragStartY;
    
    // Adjust pan by dx/dy scaled according to current zoom
    state.panX += dx / state.zoom;
    state.panY += dy / state.zoom;
    
    state.dragStartX = e.clientX;
    state.dragStartY = e.clientY;
    
    drawImage();
}

function handleMouseUp() {
    state.isDragging = false;
    photoCanvas.style.cursor = 'move';
}

// Handle wheel event for zooming
function handleWheelZoom(e) {
    if (!state.image) return; // Only zoom if there's an image

    if (e.ctrlKey) {
        e.preventDefault(); // Prevent page scrolling while zooming

        if (e.deltaY < 0) {
            // Scrolling up (or equivalent) - Zoom In (Fine-grained)
            zoomInScroll();
        } else {
            // Scrolling down (or equivalent) - Zoom Out (Fine-grained)
            zoomOutScroll();
        }
    }
    // If Ctrl key is not pressed, do nothing and allow default scroll behavior
}

// Event listeners
function setupEventListeners() {
    uploadBtn.addEventListener('click', handleFileUpload);
    saveBtn.addEventListener('click', saveImage);
    rotateLeftBtn.addEventListener('click', rotateLeft);
    rotateRightBtn.addEventListener('click', rotateRight);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    resetBtn.addEventListener('click', resetTransformation);
    
    // Mouse events for dragging
    photoCanvas.addEventListener('mousedown', handleMouseDown);
    photoCanvas.addEventListener('mousemove', handleMouseMove);
    photoCanvas.addEventListener('mouseup', handleMouseUp);
    photoCanvas.addEventListener('mouseleave', handleMouseUp);

    // Add wheel event listener for Ctrl + Scroll zoom
    photoCanvas.addEventListener('wheel', handleWheelZoom, { passive: false }); // Use passive: false to allow preventDefault
}

// Initialize the app
function init() {
    initCanvas();
    setupEventListeners();
}

// Start the app when the page loads
window.addEventListener('load', init); 