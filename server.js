import express from 'express';
import { tts, getVoices } from 'edge-tts'; // ← import getVoices
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🆕 List all available voices
app.get('/api/voices', async (req, res) => {
  try {
    const voices = await getVoices();
    res.json(voices);
  } catch (err) {
    console.error('Failed to fetch voices:', err);
    res.status(500).json({ error: err.message });
  }
});

// TTS endpoint
app.post('/api/tts', async (req, res) => {
  const { text, voice = 'en-US-JennyNeural' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  try {
    const audioBuffer = await tts(text, voice);
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
