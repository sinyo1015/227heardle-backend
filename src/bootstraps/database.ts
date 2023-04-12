import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const location: string = path.join(__dirname, "../../data");

if(!fs.existsSync(location))
    fs.mkdirSync(location);

const db = new Database(`${location}/main.db`, {verbose: console.log});

const ACTION = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS albums(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_name TEXT,
            thumbnail TEXT
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS album_links(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_id INTEGER,
            type TEXT,
            link TEXT,
            FOREIGN KEY(album_id) REFERENCES albums(id) ON UPDATE CASCADE ON DELETE CASCADE
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS track_list(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_id INTEGER,
            name TEXT,
            FOREIGN KEY(album_id) REFERENCES albums(id) ON UPDATE CASCADE ON DELETE CASCADE
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS track_list_streaming_sites(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            track_list_id INTEGER,
            type TEXT,
            link TEXT,
            FOREIGN KEY(track_list_id) REFERENCES track_list(id) ON UPDATE CASCADE ON DELETE CASCADE
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS daily_challanges(
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            start_datetime TEXT,
            end_datetime TEXT,
            track_id INTEGER,
            file_name TEXT,

            FOREIGN KEY(track_id) REFERENCES track_list(id) ON UPDATE CASCADE ON DELETE SET NULL
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS announcements(
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT,
            content TEXT,
            created_at TEXT
        );
    `);
};

export default ACTION;
