const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'dev.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Destination (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    packageCount INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS TourPackage (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    destinationId TEXT NOT NULL,
    destinationName TEXT NOT NULL,
    description TEXT NOT NULL,
    shortDescription TEXT NOT NULL,
    duration TEXT NOT NULL,
    nights INTEGER NOT NULL,
    price REAL NOT NULL,
    rating REAL NOT NULL DEFAULT 0.0,
    category TEXT NOT NULL,
    mainImage TEXT NOT NULL,
    highlights TEXT NOT NULL DEFAULT '[]',
    inclusions TEXT NOT NULL DEFAULT '[]',
    exclusions TEXT NOT NULL DEFAULT '[]',
    images TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (destinationId) REFERENCES Destination(id)
  );

  CREATE TABLE IF NOT EXISTS Itinerary (
    id TEXT PRIMARY KEY,
    packageId TEXT NOT NULL,
    day INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (packageId) REFERENCES TourPackage(id)
  );

  CREATE TABLE IF NOT EXISTS Enquiry (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    destination TEXT,
    travelDate TEXT,
    travellers INTEGER NOT NULL DEFAULT 1,
    message TEXT NOT NULL,
    packageId TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (packageId) REFERENCES TourPackage(id)
  );

  CREATE TABLE IF NOT EXISTS Testimonial (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    rating REAL NOT NULL,
    review TEXT NOT NULL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS Lead (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    requirement TEXT,
    source TEXT DEFAULT 'popup',
    status TEXT NOT NULL DEFAULT 'NEW',
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
