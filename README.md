# Image LSB / Blind Watermark Viewer

This is a small, self-contained reimplementation of the online tool at  
`https://tools.qwerto.cc/blind_watermark/`, designed to run entirely on your local machine.

It lets you inspect the low-order bits (LSB) of an image's color channels, which is useful
for exploring blind watermarks and simple steganography.

## Features

- Load an image directly from disk (no upload to any server).
- Switch through multiple viewing modes:
  - Original image and inverted colors.
  - Full single-channel views (R / G / B / Alpha).
  - Individual bit-plane views for each channel (Plane 0, 1, 2).
  - Two simple random color maps to highlight subtle differences.
- Keyboard shortcuts: use the left/right arrow keys to change modes.

## How to run locally

No build step or backend is required; everything is plain HTML/CSS/JS.

### Option 1 – Open directly

1. Open `index.html` in your browser (double-click it or drag it into a browser window).
2. Click **“Choose Image”**, select an image file.
3. Use the `<` / `>` buttons or the arrow keys to explore different modes.

### Option 2 – Serve with a simple HTTP server

If your browser has strict file-access rules (for example with some Chrome configurations),
you can serve the directory with a tiny static server:

```bash
cd /Users/zerozaki07/tmp/blindwater
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

