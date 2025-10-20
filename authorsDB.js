const sqlite = require('node:sqlite');
const db = new sqlite.DatabaseSync('videos.db');
const z = require('zod');

const getAllAuthorsQuery = db.prepare('SELECT * FROM authors ORDER BY id DESC');
const findAuthorQuery = db.prepare('SELECT * FROM authors WHERE id = ?');
const deleteAuthorQuery = db.prepare('DELETE FROM authors WHERE id = ?');
const createAuthorQuery = db.prepare("INSERT INTO authors (username, status) VALUES (?, ?)");
const updateAuthorQuery = db.prepare("UPDATE authors SET username = ?, status = ? WHERE id = ?");

class AuthorsDB {
  static schema = z.object({
    username: z.string().min(1).max(32),
    status: z.string().min(1).max(32).optional().default(null),
  });
  static getAll = () => getAllAuthorsQuery.all();
  static getOne = (id) => findAuthorQuery.get(id);
  static delete = (id) => deleteAuthorQuery.run(id);
  static create = (...author) => createAuthorQuery.run(...author);
  static update = (...author) => updateAuthorQuery.run(...author);
}

module.exports = AuthorsDB;