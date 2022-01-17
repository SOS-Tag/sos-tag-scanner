import express from 'express';
import ejs from 'ejs';
import fetch from 'node-fetch';

// Medical sheets just as example
import DUMB_SHEETS from './dumbdata.js';

const app = express();
const PORT = 8000;


app.get('/:qrcode', async (req, res) => {
  console.log(`[GET] ${req.params.qrcode}`);

  // Simulates API call to database
  const r = await fetch(`http://127.0.0.1:${PORT}/data/${req.params.qrcode}`)

  if (r.status === 200) {
    const sheet = await r.json();
    ejs.renderFile('sostag.ejs', sheet,
      {}, (err, template) => {
        if (err) {
          throw err;
        } else {
          res.end(template);
        }
      });

  } else if (r.status === 404) {
    res.status(404).send('404: Fiche introuvable 🍉🌵');

  } else {
    res.status(500).send('500: March pas :\'(');
  }
});


// Simulates API endpoint of the database
app.get('/data/:qrcode', (req, res) => {
  const sheet = DUMB_SHEETS[req.params.qrcode];
  if (sheet)
    res.json(sheet)
  else
    res.sendStatus(404);
});


app.get('/', (req, res) => {
  res.status(404).send('404: Aucun QR Code spécifié 🍉🌵');
});


app.listen(PORT, (error) => {
  if (error)
    throw error;
  else
    console.log("[---] Listening on port 8000");
});
