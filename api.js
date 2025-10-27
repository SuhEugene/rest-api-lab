const Authors = require('./authorsDB');
const Videos = require('./videosDB');

const router = require('express').Router();

router.get('/videos', async (_req, res) => res.send(Videos.getAll()));

router.get('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid video ID' });

    const video = Videos.getOne(id);
    if (!video) return res.status(404).send({ error: 'Video not found' });
    
    res.send(video);
});

router.post('/videos', (req, res) => {
    const { data, error, success } = Videos.schema.safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    const author = Authors.getOne(data.author);
    if (!author) return res.status(400).send({ error: 'Invalid author' });

    Videos.create(data.author, data.description, data.url);
    res.status(201).send({ success: true });
});

router.put('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid video ID' });

    const { data, error, success } = Videos.schema.safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    const author = Authors.getOne(data.author);
    if (!author) return res.status(400).send({ error: 'Invalid author' });

    Videos.update(data.author, data.description, data.url, id);
    res.status(200).send({ success: true });
});

router.patch('/videos/:id', (req, res) => {
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

router.delete('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid video ID' });

    const video = Videos.getOne(id);
    if (!video) return res.status(404).send({ error: 'Video not found' });
    
    Videos.delete(id);
    res.status(200).send({ success: true });
});

router.get('/authors', async (_req, res) => res.send(Authors.getAll()));

router.get('/authors/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid author ID' });

    const author = Authors.getOne(id);
    if (!author) return res.status(404).send({ error: 'Author not found' });
    
    res.send(author);
});

router.post('/authors', (req, res) => {
    const { data, error, success } = Authors.schema.safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    Authors.create(data.username, data.status);
    res.status(201).send({ success: true });
});

router.put('/authors/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid author ID' });

    const { data, error, success } = Authors.schema.safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    Authors.update(data.username, data.status, id);
    res.status(200).send({ success: true });
});

router.patch('/authors/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid author ID' });

    const author = Authors.getOne(id);
    if (!author) return res.status(404).send({ error: 'Author not found' });

    const { data, error, success } = Authors.schema.partial().safeParse(req.body);
    if (!success) return res.status(400).send({ error: "Invalid body", issues: error.issues });

    Authors.update(data.username || author.username, data.status || author.status, id);
    res.status(200).send({ success: true });
});

router.delete("/authors/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).send({ error: 'Invalid author ID' });

    const author = Authors.getOne(id);
    if (!author) return res.status(404).send({ error: 'Author not found' });
    
    Authors.delete(id);
    res.status(200).send({ success: true });
});

module.exports = router;