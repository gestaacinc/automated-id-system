const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Directory to save generated IDs
const OUTPUT_DIR = 'C:/Users/CHESTER/generated_ids';
fs.ensureDirSync(OUTPUT_DIR);

// Serve logos staticly if needed
app.use('/logos', express.static(path.join(__dirname, 'logos')));

app.post('/api/save-id', async (req, res) => {
    try {
        const { fileName, pdfBase64 } = req.body;
        if (!fileName || !pdfBase64) {
            return res.status(400).send({ error: 'Missing fileName or pdfBase64' });
        }

        const buffer = Buffer.from(pdfBase64, 'base64');
        const filePath = path.join(OUTPUT_DIR, fileName);

        await fs.writeFile(filePath, buffer);
        console.log(`Saved ID: ${filePath}`);

        res.send({ message: 'ID saved successfully', path: filePath });
    } catch (error) {
        console.error('Error saving ID:', error);
        res.status(500).send({ error: 'Failed to save ID' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
    console.log(`Generated IDs will be saved to: ${OUTPUT_DIR}`);
});
