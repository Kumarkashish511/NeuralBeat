# VerseForge Chrome Extension - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Generate Icons
1. Open `create-icons.html` in your browser
2. Click "Generate Icons" (auto-generated on load)
3. Right-click each icon canvas and save as:
   - `icons/icon16.png`
   - `icons/icon32.png`
   - `icons/icon48.png`
   - `icons/icon128.png`

### Step 2: Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder

### Step 3: Start Backend Server
```bash
cd backend
node server.js
```
Make sure it's running on `http://localhost:3001`

### Step 4: Configure Extension
1. Click the VerseForge icon in Chrome toolbar
2. In the footer, verify API URL is `http://localhost:3001`
3. Click "Save" if you changed it

### Step 5: Generate Your First Song!
1. Enter a prompt: "Drake song about late night vibes"
2. Click "Generate Song"
3. Wait for generation (watch the progress bar)
4. Play, download, or view lyrics!

## 🎨 Features

- ✅ Same beautiful dark theme as web app
- ✅ Real-time progress updates
- ✅ Built-in audio player
- ✅ Download songs
- ✅ View lyrics
- ✅ Customizable settings (Creativity, Balance, BPM)

## 🔧 Troubleshooting

**Extension icon is missing?**
- Make sure you created all 4 icon files in the `icons/` folder

**Can't connect to backend?**
- Check backend is running: `node backend/server.js`
- Verify API URL in extension settings
- Check browser console (right-click popup → Inspect)

**Song generation fails?**
- Check backend console for errors
- Verify API keys in `backend/.env`
- Make sure CORS is configured (already done in server.js)

## 📝 Notes

- The extension stores your API URL preference in Chrome storage
- Songs are streamed from your backend server
- Audio files are temporarily stored on the backend

Enjoy creating music with VerseForge! 🎵
