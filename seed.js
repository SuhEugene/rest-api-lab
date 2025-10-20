const sqlite = require('node:sqlite');
const db = new sqlite.DatabaseSync('videos.db');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

db.exec('PRAGMA foreign_keys = ON');
db.exec('DROP TABLE IF EXISTS authors');
db.exec(`
  CREATE TABLE authors (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    status TEXT DEFAULT NULL
  )
`);

db.exec('DROP TABLE IF EXISTS videos');
db.exec(`
  CREATE TABLE videos (
    id INTEGER PRIMARY KEY, 
    author_id INTEGER NOT NULL,
    description TEXT DEFAULT NULL,
    url TEXT NOT NULL,
    upload_date DATE NOT NULL,
    FOREIGN KEY(author_id) REFERENCES authors(id) ON DELETE CASCADE
  )
`);

const authors = [
  {
    username: "Andrew",
    status: "Active"
  },
  {
    username: "Thomas",
    status: "Active"
  },
  {
    username: "John",
    status: "Active"
  },
];

const videos = [
  {
    author: 1,
    description: "A serene glade at sunset",
    url: "https://cdn.coverr.co/videos/coverr-glade-at-sunset-9764/720p.mp4",
    upload_date: "2023-01-01"
  },
  {
    author: 2,
    description: "A breathtaking sunset over the Atlantic Ocean",
    url: "https://cdn.coverr.co/videos/coverr-sunset-over-the-atlantic-ocean-1409/720p.mp4",
    upload_date: "2024-02-02"
  },
  {
    author: 3,
    url: "https://cdn.coverr.co/videos/coverr-woman-running-outdoors-3013/720p.mp4",
    upload_date: "2025-03-03"
  },
];

const Authors = require('./authorsDB');
const Videos = require('./videosDB');

async function seed() {
  await sleep(300);
  
  let counter = 0;
  for (const author of authors) {
    Authors.create(author.username, author.status);
    console.log("Authors created:", ++counter, "of", authors.length);
    await sleep(30);
  }
  counter = 0;
  for (const video of videos) {
    Videos.create(video.author, video.description || null, video.url);
    console.log("Videos created:", ++counter, "of", videos.length);
    await sleep(1000);
  }
}

seed();