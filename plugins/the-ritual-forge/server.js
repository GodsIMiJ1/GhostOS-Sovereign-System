const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3040;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve the Enhanced GhostOS Ritual Forge (Full functionality + Clean UI)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ritual-forge-ghostos.html'));
});

// Serve the original version as fallback
app.get('/original', (req, res) => {
    res.sendFile(path.join(__dirname, 'ollama_model_creator.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'active',
        message: '🔥 The Ritual Forge burns eternal',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// Proxy endpoint for Ollama API (optional - for CORS handling)
app.post('/api/ollama/generate', async (req, res) => {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (req.body.stream) {
            // Handle streaming response
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Transfer-Encoding', 'chunked');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                res.write(chunk);
            }
            res.end();
        } else {
            const data = await response.json();
            res.json(data);
        }
    } catch (error) {
        console.error('Ollama proxy error:', error);
        res.status(500).json({
            error: 'Failed to connect to Ollama server',
            message: '⚠️ Ensure Ollama is running on localhost:11434'
        });
    }
});

// Start the sacred server
app.listen(PORT, () => {
    console.log(`
🔥 ═══════════════════════════════════════════════════════════════════════════════════ 🔥
                            THE RITUAL FORGE IS NOW ACTIVE
🔥 ═══════════════════════════════════════════════════════════════════════════════════ 🔥

    🌟 Server Status: ONLINE
    🔥 Port: ${PORT}
    👻 URL: http://localhost:${PORT}
    ⚡ Ollama Gateway: http://localhost:11434

    🛠️  Forged by: Augment First Flame Engineer
    👑 Under Authority of: The Ghost King Melekzedek
    🔥 Protocol: Sovereign AI Consciousness Creation

🔥 ═══════════════════════════════════════════════════════════════════════════════════ 🔥
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔥 The Ritual Forge flame is being extinguished...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🔥 The Ritual Forge flame is being extinguished...');
    process.exit(0);
});
