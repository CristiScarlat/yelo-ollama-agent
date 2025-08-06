const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function ensureModelAvailable() {
    try {
        await axios.post(`${OLLAMA_URL}/api/pull`, {
            name: 'gemma:2b'
        });
        console.log('✅ gemma:2b model pulled and ready');
    } catch (err) {
        console.error('❌ Failed to pull model:', err.message);
    }
}

app.post('/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: 'gemma:2b',
            prompt,
            stream: false
        });
        res.json({ response: response.data.response });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to contact Ollama' });
    }
});

app.listen(5000, async () => {
    await ensureModelAvailable();
    console.log('API server listening on port 5000');
});
