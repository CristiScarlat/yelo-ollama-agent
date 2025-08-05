const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function ensureModelAvailable() {
    try {
        await axios.post(`${OLLAMA_URL}/api/pull`, {
            name: 'llama3'
        });
        console.log('✅ LLaMA3 model pulled and ready');
    } catch (err) {
        console.error('❌ Failed to pull model:', err.message);
    }
}

app.post('/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: 'llama3',  // or another model you’ve pulled
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
