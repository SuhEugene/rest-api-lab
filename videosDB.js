const sqlite = require('node:sqlite');
const db = new sqlite.DatabaseSync('videos.db');
const z = require('zod');

const getAllVideosQuery = db.prepare(`
  SELECT videos.id, authors.username AS author, videos.description
  FROM videos
  JOIN authors ON videos.author_id = authors.id
  ORDER BY videos.upload_date DESC
`);
const findVideoQuery = db.prepare(`
  SELECT videos.*, authors.username, authors.status
  FROM videos
  JOIN authors ON videos.author_id = authors.id
  WHERE videos.id = ?
`);
const deleteVideoQuery = db.prepare('DELETE FROM videos WHERE id = ?');
const createVideoQuery = db.prepare("INSERT INTO videos (author_id, description, url, upload_date) VALUES (?, ?, ?, DATETIME('now', 'localtime'))");
const updateVideoQuery = db.prepare("UPDATE videos SET author_id = ?, description = ?, url = ?, upload_date = DATETIME('now', 'localtime') WHERE id = ?");

class VideosDB {
  static schema = z.object({
    author: z.int().min(1),
    description: z.string().min(1).max(128).optional().default(null),
    url: z.string().min(10).max(128),
  });
  static getAll = () => getAllVideosQuery.all();
  static getOne = (id) => findVideoQuery.get(id);
  static delete = (id) => deleteVideoQuery.run(id);
  static create = (...video) => createVideoQuery.run(...video);
  static update = (...video) => updateVideoQuery.run(...video);
}

module.exports = VideosDB;