// VerseForge Chrome Extension - Main Script

// Default API URL (stored but not visible in UI)
const DEFAULT_API_URL = 'http://localhost:3001';

// DOM Elements
const elements = {
  promptInput: document.getElementById('promptInput'),
  generateBtn: document.getElementById('generateBtn'),
  toggleSettings: document.getElementById('toggleSettings'),
  settingsPanel: document.getElementById('settingsPanel'),
  temperature: document.getElementById('temperature'),
  temperatureValue: document.getElementById('temperatureValue'),
  balance: document.getElementById('balance'),
  balanceValue: document.getElementById('balanceValue'),
  bpm: document.getElementById('bpm'),
  bpmValue: document.getElementById('bpmValue'),
  progressSection: document.getElementById('progressSection'),
  progressBar: document.getElementById('progressBar'),
  progressStatus: document.getElementById('progressStatus'),
  progressPercentage: document.getElementById('progressPercentage'),
  progressMessage: document.getElementById('progressMessage'),
  resultSection: document.getElementById('resultSection'),
  songTitle: document.getElementById('songTitle'),
  closeResult: document.getElementById('closeResult'),
  audioElement: document.getElementById('audioElement'),
  playBtn: document.getElementById('playBtn'),
  playingIndicator: document.getElementById('playingIndicator'),
  seekBar: document.getElementById('seekBar'),
  currentTime: document.getElementById('currentTime'),
  duration: document.getElementById('duration'),
  volumeBtn: document.getElementById('volumeBtn'),
  toggleLyrics: document.getElementById('toggleLyrics'),
  lyricsContent: document.getElementById('lyricsContent'),
  lyricsSection: document.getElementById('lyricsSection'),
  downloadBtn: document.getElementById('downloadBtn'),
  newSongBtn: document.getElementById('newSongBtn'),
  errorSection: document.getElementById('errorSection'),
  errorMessage: document.getElementById('errorMessage'),
  dismissError: document.getElementById('dismissError'),
  apiUrl: document.getElementById('apiUrl'),
  saveConfig: document.getElementById('saveConfig')
};

// State
let currentSongData = null;
let isPlaying = false;
let isMuted = false;
let volume = 1.0;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  setupEventListeners();
  updateSliderValues();
  await restoreState();
});

// Restore state from storage
async function restoreState() {
  try {
    // Get saved song data from storage
    const storage = await chrome.storage.local.get(['currentSongData', 'audioUrl', 'prompt']);

    if (storage.currentSongData && storage.audioUrl) {
      // Restore song data
      currentSongData = storage.currentSongData;

      // Show result section
      showResult(storage.currentSongData, storage.audioUrl);

      // Restore prompt
      if (storage.prompt) {
        elements.promptInput.value = storage.prompt;
      }
    }
  } catch (error) {
    console.error('Error restoring state:', error);
  }
}

// Load configuration from storage
async function loadConfig() {
  try {
    const result = await chrome.storage.sync.get(['apiUrl']);
    if (result.apiUrl) {
      elements.apiUrl.value = result.apiUrl;
    } else {
      elements.apiUrl.value = DEFAULT_API_URL;
    }
  } catch (error) {
    console.error('Error loading config:', error);
    elements.apiUrl.value = DEFAULT_API_URL;
  }
}

// Save configuration
async function saveConfig() {
  try {
    await chrome.storage.sync.set({ apiUrl: elements.apiUrl.value });
    showMessage('Configuration saved!', 'success');
  } catch (error) {
    console.error('Error saving config:', error);
    showError('Failed to save configuration');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Generate button
  elements.generateBtn.addEventListener('click', handleGenerate);

  // Settings toggle
  elements.toggleSettings.addEventListener('click', () => {
    const isActive = elements.settingsPanel.classList.toggle('active');
    // Expand/collapse container
    if (isActive) {
      document.body.classList.add('settings-open');
      document.querySelector('.container').classList.add('settings-open');
    } else {
      document.body.classList.remove('settings-open');
      document.querySelector('.container').classList.remove('settings-open');
    }
  });

  // Sliders
  elements.temperature.addEventListener('input', () => {
    elements.temperatureValue.textContent = elements.temperature.value;
  });

  elements.balance.addEventListener('input', () => {
    elements.balanceValue.textContent = elements.balance.value;
  });

  elements.bpm.addEventListener('input', () => {
    elements.bpmValue.textContent = elements.bpm.value;
  });

  // Audio controls
  elements.playBtn.addEventListener('click', togglePlay);
  elements.audioElement.addEventListener('timeupdate', updateTime);
  elements.audioElement.addEventListener('loadedmetadata', updateDuration);
  elements.audioElement.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    showError('Failed to load audio. Please try again.');
    isPlaying = false;
    elements.playBtn.textContent = '▶';
    elements.playingIndicator.style.display = 'none';
  });
  elements.audioElement.addEventListener('ended', () => {
    isPlaying = false;
    elements.playBtn.textContent = '▶';
    elements.playingIndicator.style.display = 'none';
  });

  // Sync play state
  elements.audioElement.addEventListener('play', () => {
    isPlaying = true;
    elements.playBtn.textContent = '⏸';
    elements.playingIndicator.style.display = 'flex';
  });

  elements.audioElement.addEventListener('pause', () => {
    isPlaying = false;
    elements.playBtn.textContent = '▶';
    elements.playingIndicator.style.display = 'none';
  });
  elements.seekBar.addEventListener('input', handleSeek);
  elements.volumeBtn.addEventListener('click', toggleMute);

  // Lyrics toggle
  elements.toggleLyrics.addEventListener('click', () => {
    const isVisible = elements.lyricsContent.style.display !== 'none';
    elements.lyricsContent.style.display = isVisible ? 'none' : 'block';
    elements.toggleLyrics.textContent = isVisible ? 'Show Lyrics' : 'Hide Lyrics';
  });

  // Result actions
  elements.closeResult.addEventListener('click', closeResult);
  elements.newSongBtn.addEventListener('click', () => {
    closeResult();
    elements.promptInput.value = '';
  });
  elements.downloadBtn.addEventListener('click', handleDownload);

  // Error handling
  elements.dismissError.addEventListener('click', () => {
    elements.errorSection.style.display = 'none';
  });

  // Config (hidden but still functional)
  if (elements.saveConfig) {
    elements.saveConfig.addEventListener('click', saveConfig);
  }

  // Enter key to generate
  elements.promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  });
}

// Update slider value displays
function updateSliderValues() {
  elements.temperatureValue.textContent = elements.temperature.value;
  elements.balanceValue.textContent = elements.balance.value;
  elements.bpmValue.textContent = elements.bpm.value;
}

// Handle song generation
async function handleGenerate() {
  const prompt = elements.promptInput.value.trim();
  if (!prompt) {
    showError('Please enter a song description');
    return;
  }

  const apiUrl = elements.apiUrl.value || DEFAULT_API_URL;

  // Hide previous results/errors
  elements.resultSection.style.display = 'none';
  elements.errorSection.style.display = 'none';

  // Show progress
  elements.progressSection.style.display = 'block';
  elements.generateBtn.disabled = true;
  elements.generateBtn.querySelector('.btn-text').textContent = 'Generating...';

  try {
    const response = await fetch(`${apiUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput: prompt,
        temperature: parseFloat(elements.temperature.value),
        balance: parseFloat(elements.balance.value),
        bpm: parseInt(elements.bpm.value)
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Handle SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            handleProgressUpdate(data);
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

  } catch (error) {
    console.error('Generation error:', error);
    showError(`Failed to generate song: ${error.message}`);
    elements.progressSection.style.display = 'none';
    elements.generateBtn.disabled = false;
    elements.generateBtn.querySelector('.btn-text').textContent = 'Generate Song';
  }
}

// Handle progress updates from SSE
function handleProgressUpdate(data) {
  // Check if elements exist before accessing them
  if (!elements.progressSection || !elements.progressBar || !elements.progressPercentage) {
    console.warn('Progress elements not found');
    return;
  }

  if (data.complete) {
    if (data.error) {
      showError(data.error);
      if (elements.progressSection) elements.progressSection.style.display = 'none';
      if (elements.generateBtn) {
        elements.generateBtn.disabled = false;
        const btnText = elements.generateBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Generate Song';
      }
      return;
    }

    // Generation complete
    currentSongData = data;
    showResult(data);
    if (elements.progressSection) elements.progressSection.style.display = 'none';
    if (elements.generateBtn) {
      elements.generateBtn.disabled = false;
      const btnText = elements.generateBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Generate Song';
    }
    return;
  }

  // Update progress
  if (data.progress !== undefined) {
    if (elements.progressBar) elements.progressBar.style.width = `${data.progress}%`;
    if (elements.progressPercentage) elements.progressPercentage.textContent = `${data.progress}%`;
  }

  if (data.status) {
    if (elements.progressStatus) elements.progressStatus.textContent = data.status.replace(/_/g, ' ');
  }

  if (data.message) {
    if (elements.progressMessage) elements.progressMessage.textContent = data.message;
  }
}

// Show result
function showResult(data, audioUrlOverride = null) {
  elements.resultSection.style.display = 'block';

  // Set lyrics
  if (data.lyrics) {
    elements.lyricsContent.textContent = data.lyrics;
  }

  // Load audio
  let audioUrl;
  if (audioUrlOverride) {
    audioUrl = audioUrlOverride;
  } else if (data.audioFiles && data.audioFiles.length > 0) {
    const apiUrl = elements.apiUrl.value || DEFAULT_API_URL;
    audioUrl = `${apiUrl}/audio/${data.audioFiles[0]}`;
  }

  if (audioUrl) {
    elements.audioElement.src = audioUrl;
    elements.audioElement.load();

    // Save to background service worker and storage
    const prompt = elements.promptInput.value.trim();
    chrome.runtime.sendMessage({
      action: 'saveSongData',
      songData: data,
      audioUrl: audioUrl
    });

    chrome.storage.local.set({
      currentSongData: data,
      audioUrl: audioUrl,
      prompt: prompt
    });
  }

  // Update song title
  const prompt = elements.promptInput.value.trim();
  elements.songTitle.textContent = prompt || 'Generated Song';
}

// Close result
async function closeResult() {
  elements.resultSection.style.display = 'none';
  // Clear storage
  await chrome.storage.local.remove(['currentSongData', 'audioUrl', 'prompt']);
  if (elements.audioElement) {
    elements.audioElement.pause();
    elements.audioElement.src = '';
  }
  isPlaying = false;
  elements.playBtn.textContent = '▶';
  elements.playingIndicator.style.display = 'none';
  currentSongData = null;
}

// Audio controls
async function togglePlay() {
  if (!elements.audioElement.src) return;

  try {
    if (isPlaying) {
      elements.audioElement.pause();
      elements.playBtn.textContent = '▶';
      elements.playingIndicator.style.display = 'none';
      isPlaying = false;
    } else {
      await elements.audioElement.play();
      elements.playBtn.textContent = '⏸';
      elements.playingIndicator.style.display = 'flex';
      isPlaying = true;
    }
  } catch (error) {
    console.error('Error toggling playback:', error);
    showError('Failed to play audio. Please try again.');
    isPlaying = false;
    elements.playBtn.textContent = '▶';
    elements.playingIndicator.style.display = 'none';
  }
}

function toggleMute() {
  isMuted = !isMuted;
  elements.audioElement.muted = isMuted;
  elements.volumeBtn.textContent = isMuted ? '🔇' : '🔊';
}

async function updateTime() {
  const current = elements.audioElement.currentTime;
  const dur = elements.audioElement.duration;

  if (dur) {
    const percent = (current / dur) * 100;
    elements.seekBar.value = percent;
    elements.currentTime.textContent = formatTime(current);
  }
}

function updateDuration() {
  const dur = elements.audioElement.duration;
  if (dur) {
    elements.duration.textContent = formatTime(dur);
    elements.seekBar.max = 100;
  }
}

async function handleSeek(e) {
  const percent = e.target.value;
  const dur = elements.audioElement.duration;
  if (dur) {
    const newTime = (percent / 100) * dur;
    elements.audioElement.currentTime = newTime;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Download handler
async function handleDownload() {
  if (!currentSongData || !currentSongData.audioFiles || currentSongData.audioFiles.length === 0) {
    showError('No audio file available to download');
    return;
  }

  try {
    const apiUrl = elements.apiUrl.value || DEFAULT_API_URL;
    const audioUrl = `${apiUrl}/audio/${currentSongData.audioFiles[0]}`;

    const response = await fetch(audioUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `verseforge-song-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showMessage('Download started!', 'success');
  } catch (error) {
    console.error('Download error:', error);
    showError('Failed to download audio file');
  }
}

// Error handling
function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorSection.style.display = 'block';
  elements.progressSection.style.display = 'none';
}

function showMessage(message, type = 'info') {
  // Simple message display (could be enhanced with toast notifications)
  console.log(`[${type.toUpperCase()}] ${message}`);
}
