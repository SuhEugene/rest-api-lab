const Authors = require('./authorsDB');
const Videos = require('./videosDB');

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (_req, res) => res.send('Server is running'));

app.get('/videos', async (_req, res) => res.send(Videos.getAll()));

app.get('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid video ID' });

    const video = Videos.getOne(id);
    if (!video) return res.status(404).send({ error: 'Video not found' });
    
    res.send(video);
});

app.post('/videos', (req, res) => {
    const { data, error, success } = Videos.schema.safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    const author = Authors.getOne(data.author);
    if (!author) return res.status(400).send({ error: 'Invalid author' });

    Videos.create(data.author, data.description, data.url);
    res.status(201).send({ success: true });
});

app.put('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid video ID' });

    const { data, error, success } = Videos.schema.safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    const author = Authors.getOne(data.author);
    if (!author) return res.status(400).send({ error: 'Invalid author' });

    Videos.update(data.author, data.description, data.url, id);
    res.status(200).send({ success: true });
});

app.patch('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid video ID' });

    const video = Videos.getOne(id);
    if (!video) return res.status(404).send({ error: 'Video not found' });

    const { data, error, success } = Videos.schema.partial().safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    const author = Authors.getOne(data.author);
    if (!author) return res.status(400).send({ error: 'Invalid author' });

    Videos.update(data.author || video.author, data.description || video.description, data.url || video.url, id);
    res.status(200).send({ success: true });
});

app.delete('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid video ID' });

    const video = Videos.getOne(id);
    if (!video) return res.status(404).send({ error: 'Video not found' });
    
    Videos.delete(id);
    res.status(200).send({ success: true });
});

app.delete("/authors/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid author ID' });

    const author = Authors.getOne(id);
    if (!author) return res.status(404).send({ error: 'Author not found' });
    
    Authors.delete(id);
    res.status(200).send({ success: true });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));