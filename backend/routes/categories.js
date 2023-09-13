import express from 'express';
import sqlite3 from 'sqlite3';
import db from '../connection.js';

sqlite3.verbose();
const router = express.Router();

router.post("/category-register", (req, res) => {
    db.serialize(() => {

        function validation(name) {
            if (name == "") return false;
            return true;
        }
        
        const { name } = req.body;
        let valid = validation(name);

        const stmt = db.prepare(`INSERT INTO categories (name) VALUES (?)`,
            req.body.name);
        if (valid) {
            stmt.run( function (err) {
                if(err) res.status(400).json({ error: "Sikertelen kategória létrehozás" });
                else res.json({ message: "ok" })
            })
        } else {
            res.status(400).json({ error: "Megnevezés nem lehet üres" });
        }
    });
})

router.get("/categories", (req, res) => {
    console.log(req.query);
    if (Object.keys(req.query).length == 0) {
        db.all('SELECT * FROM categories', (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
            }
            else {
                return res.status(201).json(rows);
            }
        })
    }
    else {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;

        db.serialize(() => {
            db.all('SELECT COUNT(*) AS total FROM categories', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                }
                console.log(req.query);
                const totalItems = rows[0].total;
                const totalPages = Math.ceil(totalItems / limit);
                const offset = (page - 1) * limit;
                console.log(req.query, "query");
                const orderBy = req.query.orderBy !== 'null' ? req.query.orderBy : 'name';
                const order = req.query.order !== 'null' ? req.query.order : 'ASC';
                console.log(order)
                console.log(orderBy)
                db.run('PRAGMA foreign_keys=ON');
                db.all(`SELECT categories.id, name FROM categories ORDER BY ${orderBy} ${order} LIMIT ${limit} OFFSET ${offset}`, (err, categories) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                    }
                    console.log(categories)
                    return res.json({ categories, totalPages });
                });
            });
        });
    }
});

router
    .route("/categories/:id")
    .put((req, res) => {
        console.log(req.params, "params");
        const { id } = req.body;
        const { name } = req.body;

        db.serialize(() => {
            const stmt2 = db.prepare("UPDATE categories SET name=$name WHERE id=$id", {
                $name: name,
                $id: id
            })
            stmt2.run((err) => {
                if (err) {
                    console.log('error', err)
                    res.send({error: "Sikertelen kategória módosítás!"})
                } else {
                    res.send({id})
                }
            })
        })
    })

    .delete((req, res) => {
        const { id } = req.params;
        console.log(req.params, "par");
        db.serialize(() => {
            const stmt2 = db.prepare("DELETE FROM categories WHERE id=$id", id,)
            stmt2.run((err) => {
                if (err) {
                    res.json({error: "Sikertelen kategória törlés"})
                } else {
                    res.json({ id })
                }
            })
        })
    })

    .get((req, res) => {
        const { id } = req.params;
        console.log(id, "id");
        db.get("SELECT * FROM categories WHERE id=?", id, (err, row) => {
            if (err) {
                console.error("get categories", err);
                res.status(500).json({ error: "Adatbázis hiba" });
            } else {
                res.json(row);
            }
        })
    })

export default router;