import express from 'express';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/qr', (req, res) => {
  const url = req.body.link;
  const qr_svg = qr.image(url, { type: 'svg' });
  
  const qrBuffer = [];
  qr_svg.on('data', chunk => qrBuffer.push(chunk));
  
  qr_svg.on('end', () => {
    const qrSvgString = Buffer.concat(qrBuffer).toString('utf-8');
    fs.writeFileSync(path.join(__dirname, 'public', 'qr_image.svg'), qrSvgString);
    res.sendFile(path.join(__dirname, '/public/QR.html'));
  });
});
app.get('/download', (req, res) => {
    res.download(path.join(__dirname, 'public', 'qr_image.svg'), 'qr_image.svg');
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
