const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/synthesize', async (req, res) => {
  const { text, voice = 'en-US-JennyNeural' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  try {
    // ✅ Dynamically import the ES module
    const { tts } = await import('edge-tts');
    const audioBuffer = await tts(text, voice);
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));