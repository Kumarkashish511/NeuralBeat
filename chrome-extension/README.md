# VerseForge Chrome Extension

A Chrome extension that brings the power of VerseForge AI music generation directly to your browser.

## Features

- 🎵 **AI-Powered Song Generation** - Create professional songs with AI-generated lyrics
- 🎨 **Same Beautiful Design** - Matches the VerseForge web app aesthetics
- ⚡ **Real-time Progress** - Watch your song being generated in real-time
- 🎧 **Built-in Audio Player** - Play and control your generated songs
- 📥 **Download Songs** - Save your creations directly to your device
- ⚙️ **Customizable Settings** - Adjust creativity, vocal balance, and BPM

## Installation

### From Source (Developer Mode)

1. **Clone or download this repository**
   ```bash
   cd chrome-extension
   ```

2. **Create Extension Icons**
   - Create an `icons` folder in the `chrome-extension` directory
   - Generate icons in sizes: 16x16, 32x32, 48x48, 128x128 pixels
   - Name them: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
   - You can use the SVG logo from `public/swords.svg` as a base

3. **Load the Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

4. **Configure API URL**
   - Click the extension icon
   - In the footer, set your backend API URL (default: `http://localhost:3001`)
   - Click "Save"

## Usage

1. **Start Your Backend Server**
   ```bash
   cd backend
   node server.js
   ```
   Make sure your backend is running on `http://localhost:3001` (or your configured URL)

2. **Open the Extension**
   - Click the VerseForge icon in your Chrome toolbar
   - The extension popup will open

3. **Generate a Song**
   - Enter a song description (e.g., "Drake song about late night vibes")
   - Optionally adjust settings:
     - **Creativity**: Controls lyrical creativity (0.1 - 2.0)
     - **Vocal Balance**: Controls vocal/instrumental balance (0 - 2.0)
     - **BPM**: Sets the tempo (60 - 200)
   - Click "Generate Song"
   - Watch the progress bar as your song is created
   - Once complete, play, download, or view lyrics

## Configuration

### API URL
The extension connects to your VerseForge backend API. By default, it uses `http://localhost:3001`. You can change this in the extension popup footer.

### Permissions
The extension requires:
- **Storage**: To save your API URL preference
- **Host Permissions**: To connect to your backend API (localhost and HTTPS)

## Development

### File Structure
```
chrome-extension/
├── manifest.json       # Extension manifest
├── popup.html         # Main popup UI
├── popup.js           # Extension logic
├── styles.css         # Styling (matches web app)
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

### Making Changes

1. **Edit files** in the `chrome-extension` directory
2. **Reload the extension** in `chrome://extensions/`
   - Click the refresh icon on the extension card
3. **Test changes** by opening the extension popup

## Troubleshooting

### Extension won't load
- Make sure all required files are present
- Check that `manifest.json` is valid JSON
- Ensure icons folder exists with all icon sizes

### Can't connect to backend
- Verify your backend server is running
- Check the API URL in extension settings
- Ensure CORS is enabled on your backend (should allow localhost origins)
- Check browser console for errors (right-click extension popup → Inspect)

### Song generation fails
- Check backend server logs
- Verify API keys are configured in backend `.env` file
- Ensure backend is accessible from the configured URL

## Requirements

- Chrome/Edge browser (Chromium-based)
- VerseForge backend server running
- Backend API accessible from browser (localhost or HTTPS)

## License

Same as main VerseForge project.

## Support

For issues or questions, please refer to the main VerseForge repository.
