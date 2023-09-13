import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./webshop.db', (err) => {
    if (err) {
        console.log('Database creation error:', err);
    } else {
        db.run("PRAGMA foreign_key = ON")
        console.log('webshop is up and running')
    }

});

export default db;
