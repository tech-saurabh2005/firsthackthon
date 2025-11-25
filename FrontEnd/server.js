import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Serve static files from this directory
app.use(express.static(__dirname));

// Default file — the main page in this project appears to be `fifth3 (3).html`
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'fifth3 (3).html'));
});

app.listen(port, () => {
  console.log(`Front-end static server running at http://localhost:${port}`);
});