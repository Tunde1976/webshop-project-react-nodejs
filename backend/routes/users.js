import express from 'express';
import sqlite3 from 'sqlite3';
import db from '../connection.js';
import { nanoid } from 'nanoid';
import { validateNotEmpty, validateEmail, validatePassword } from "../utils/validationUtil.js";
import { sessions } from '../constants.js';

sqlite3.verbose();
const router = express.Router();

router.post("/auth/register", (req, res) => {
    if (!validateNotEmpty(req.body.email) || !validateNotEmpty(req.body.password) || !validateEmail(req.body.email) || !validatePassword(req.body.password)) {
        console.log("Validation error");
        res.send("Registration error.");
        return;
    }
    db.run(`INSERT INTO users (email, password, isAdmin) values (?, ?, ?)`, [
        req.body.email,
        req.body.password,
        false
    ], (err) => {
        if (err) res.send("Registration error.")
        else res.send("201 Created")
    })
});

router.post("/auth/login", (req, res) => {
    console.log(req.body);
    db.serialize(() => {
        const stmt = db.prepare(`SELECT * FROM users WHERE email = ? AND password = ?`, req.body.email, req.body.password);
        stmt.get((err, row) => {
            if (err) {
                res.send({ error: err })
            }
            if (row) {
                console.log("200 OK")
                const sessionID = nanoid(8);
                console.log(sessionID);
                const sessionData = { localID: row.id, email: row.email, isAdmin: row.isAdmin };
                sessions[sessionID] = sessionData;
                console.log(sessions[sessionID], "login sess");
                res.cookie("sessionID", sessionID, { maxAge: 900000, httpOnly: true });
                res.status(200).json({ ...sessionData, sessionID });
            }
            else {
                // res.json({ error: "Nem található felhasználó ezzel az e-mail cím és jelszó párossal! Ellenőrizd, hogy minden adatot helyesen adtál meg!" })
                res.status(400).json({ error: "404 Unauthorized" })
            }
        })
    });
});

router.post("/auth/verify", (req, res) => {
    // cookie-parser segítségével lekérjük a cookie-t (nem a body-ban jön, onnan valamiért nem lehetett kiolvasni)
    const sessionID = req.cookies.sessionID;
    console.log(req.cookies.sessionID);
    console.log(sessions, 'sessions');
    if (sessionID in sessions) {
        res.status(200).send(sessions[sessionID]);
    }
    else {
        res.send({ message: "nincs bejelentkezve" })
    }

});

router.get("/logout", (req, res) => {
    // console.log(req.query.sessionID, "query");
    console.log(req.cookies, "logout");
    delete sessions[req.cookies.sessionID];
    res.clearCookie("sessionID");
    res.send("Logout successful.");
});

router.get("/api/users", (req, res) => {
    console.log(req.query);
    if (Object.keys(req.query).length == 0) {
        db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
            }
            else {
                return res.status(201).json({ users: rows });
            }
        })
    }
    else {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;

        db.serialize(() => {
            db.all('SELECT COUNT(*) AS total FROM users', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                }
                console.log(req.query);
                const totalItems = rows[0].total;
                const totalPages = Math.ceil(totalItems / limit);
                const offset = (page - 1) * limit;
                console.log(req.query, "query");
                const orderBy = req.query.orderBy !== 'null' ? req.query.orderBy : 'email';
                const order = req.query.order !== 'null' ? req.query.order : 'ASC';
                console.log(order)
                console.log(orderBy)
                db.run('PRAGMA foreign_keys=ON');
                db.all(`SELECT users.id, email FROM users ORDER BY ${orderBy} ${order} LIMIT ${limit} OFFSET ${offset}`, (err, users) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                    }
                    console.log(users)
                    res.json({ users, totalPages });
                });
            });
        });
    }
});

router.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    console.log(id, "id");
    db.serialize(() => {
        db.get("SELECT * FROM users WHERE id = ?", id, (err, row) => {
            if (err) {
                console.log('Select error', err);
                // res.json({message: "hiba"})
            }
            console.log(row, "row");
            res.json({ "data": row || {} });
        })
    })
})

router.get("/api/userdetails/:id", (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log(id, "id");
    console.log("TESZT")
    db.serialize(() => {
        db.get(`SELECT users.id, users.email, users.password, billingaddress.surname as billing_surname, billingaddress.familyname as billing_familyname, 
        billingaddress.city as billing_city, billingaddress.street as billing_street,
         billingaddress.house_number as billing_house_number, billingaddress.postal_code as billing_postal_code,
        shippingaddress.city as shipping_city, shippingaddress.street as shipping_street,
         shippingaddress.house_number as shipping_house_number, shippingaddress.postal_code as shipping_postal_code
        FROM users JOIN shippingaddress on users.id = shippingaddress.user_id JOIN billingaddress on billingaddress.user_id = users.id WHERE id = ?`,
            id, (err, row) => {
                if (err) {
                    console.log('Select error', err);
                    // res.json({message: "hiba"})
                }
                console.log(row, "row");
                res.json({ "data": row || {} });
            })
    })
})
router.put("/api/userdetails/:id", (req, res) => {
    const query1 = `UPDATE users set email = ? where id = ?`;
    const query2 = `UPDATE billingaddress set surname = ?, familyname = ?, city = ?, street = ?, house_number = ?, postal_code = ? where user_id = ?`; 
    const query3 = `UPDATE shippingaddress set surname = ?, familyname = ?, city = ?, street = ?, house_number = ?, postal_code = ? where user_id = ?`;
        db.serialize(() => {
            console.log(req.body)
            db.run("BEGIN TRANSACTION", err => { if(err) console.log("22:", err)})
            const stmt1 = db.prepare(query1, req.body.email, req.body.id,  (err) => console.log(err, "err"));
            stmt1.run(err => { if(err) db.run("ROLLBACK")});
            const stmt2 = db.prepare(query2, req.body.billing_surname, req.body.billing_familyname, req.body.billing_city, req.body.billing_street, req.body.billing_house_number, req.body.billing_postal_code, req.body.id,  (err) => console.log(err, "err"));
            stmt2.run(err => { if(err) db.run("ROLLBACK")});
            const stmt3 = db.prepare(query3, req.body.billing_surname, req.body.billing_familyname, req.body.shipping_city, req.body.shipping_street, req.body.shipping_house_number, req.body.shipping_postal_code, req.body.id,  (err) => console.log(err, "err"));
            stmt3.run(err => { if(err) db.run("ROLLBACK")});
            db.run("COMMIT", err =>{
                console.log("21:", err)
                if(!err) res.status(201).json({id: req.body.id})
                else res.status(400).json({error: "Sikertelen módosítás"})
                })
        })
})

router.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    console.log(id, "edit ID");
    const { isAdmin } = req.body;
    db.serialize(() => {
        const stmt = db.prepare("UPDATE users SET isAdmin=$isAdmin WHERE id=$id", {
            // $email: email,
            // $password: password,
            $isAdmin: isAdmin,
            $id: id
        })
        stmt.run((err) => {
            if (err) {
                console.log('error', err)
                res.json({ error: "Sikertelen módosítás" })
            } else {
                res.status(200).json({ "localId": id })
            }
        })
    })
});

router.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    console.log(req.params, "par");
    db.serialize(() => {
        const stmt2 = db.prepare("DELETE FROM users WHERE id=?", id)
        stmt2.run((err) => {
            if (err) {
                res.json({ error: "Sikertelen törlés" })
            } else {
                res.send({ id })
            }
        })
    })
})

export default router;