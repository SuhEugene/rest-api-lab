const fs = require('fs');

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (_req, res) => res.sendFile('./pages/index.html', { root: __dirname }));
app.get('/index.css', (_req, res) => res.sendFile('./pages/index.css', { root: __dirname }));

app.use('/vids', express.static('vids'));

app.get('/videos/:id', (req, res) => {
  const file = fs.readFileSync('./pages/video.html', 'utf8')
    .replace('%%ACTION%%', req.params.id);
  req.headers['content-type'] = 'text/html';
  res.send(file);
});

app.get('/authors/:id')

app.use('/api', require('./api'));

app.listen(port, () => console.log(`Server is running on port ${port}`));