// VerseForge Background Service Worker
// Stores state but delegates audio playback to popup (service workers can't play audio)

let currentSongData = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages synchronously when possible
  try {
    if (message.action === 'saveSongData') {
      currentSongData = message.songData;
      // Save to storage for persistence
      chrome.storage.local.set({
        currentSongData: message.songData,
        audioUrl: message.audioUrl
      }).then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
      return true; // Will respond asynchronously
    } else if (message.action === 'getSongData') {
      sendResponse({
        success: true,
        songData: currentSongData
      });
      return false; // Respond immediately
    } else {
      // Unknown action
      sendResponse({ success: false, error: 'Unknown action' });
      return false;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ success: false, error: error.message });
    return false;
  }
});

// Restore state on service worker startup
chrome.storage.local.get(['currentSongData'], (result) => {
  if (result.currentSongData) {
    currentSongData = result.currentSongData;
  }
});
