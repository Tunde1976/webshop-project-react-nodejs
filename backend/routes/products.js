import express from 'express';
import sqlite3 from 'sqlite3';
import db from '../connection.js';
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from "path";
import { sessions } from '../constants.js';

sqlite3.verbose();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.use('/uploads', express.static('/uploads'))

router.post("/product-register", (req, res) => {
    const id = nanoid(10);
    const { categoryId } = req.body;
    console.log(req.body);
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO products ( id, title, description, price) VALUES (?, ?, ?, ?)`,
            id, req.body.title, req.body.description, req.body.price);
        stmt.run((err) => {
            if (err) console.log(err);
            else {
                const stmt2 = db.prepare(`INSERT INTO products_categories ( product_id, category_id) VALUES (?, ?)`);
                categoryId.forEach(cat => {
                    stmt2.run(id, cat)
                });

                stmt2.finalize((err) => {
                    if (err) {
                        console.log(err, "err in product create");
                        res.json({ error: "Sikertelen termékfeltöltés" })
                    } else {
                        res.json({ id })
                    }
                })
            }
        })
    });
});

router.get('/uploads/:imgpath', (req, res) => {
    const { imgpath } = req.params;
    res.sendFile(path.resolve(`./uploads/${imgpath}`))
})

router.post("/uploads", upload.single("pic"), (req, res) => {
    console.log(req.file);
    console.log(req.body.id);
    const newPath = req.file.path.replace(/\\/g, '/');
    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO images (filename, path, product_id) VALUES (?,?,?)", [
            req.file.originalname,
            newPath,
            req.body.id
        ]);
        stmt.run((err => {
            if (err) res.json({ error: "Sikertelen feltöltés" });
            else {
                console.log("insert into images: success");
                res.json({ message: "Sikeres feltöltés" })
            }
        }
        ))
    })
});

// router.get("/products", (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 8; // Meghatározzuk, hogy hány elem jelenjen meg egy oldalon
//     console.log(req.query.order)
//     const totalItems = rows[0].total;
//             const totalPages = Math.ceil(totalItems / limit);
//             const offset = (page - 1) * limit;
//             const orderBy = req.query.orderType ? req.query.orderType : 'title';
//             console.log(orderBy + " " + order)
//             const order = req.query.order ? req.query.order : 'ASC';
//     db.serialize(() => {
//         db.run('PRAGMA foreign_keys=ON');
//         db.all("SELECT products.id, title, description, price, filename, images.id as img_id, path FROM products JOIN images ON products.id = images.product_id LIMIT ? OFFSET ? ORDER BY ? ?", [limit, offset, orderBy, order], (err, rows) => {
//             if (err) {
//                 console.log('Select error', err);
//                 return;
//             } else {
//                 res.json({ "data": rows });
//             }
//         })
//     })
// })

router.get("/productscount", (req, res) => {
    console.log(req.query);
    db.all('SELECT products.id FROM products', (err, rows) => {
        if (err) {
            console.log(err.message);

        } else {
            res.send({ data: rows })
        }
    })
})

router.get("/products", (req, res) => {
    console.log(req.query);
    const sessionID = req.cookies.sessionID;
    let isAdmin = false;
    if (sessionID) isAdmin = sessions[sessionID].isAdmin;
    if (isAdmin) {
        const page = parseInt(req.query.page) || 1;
        const limit = 8; // Meghatározzuk, hogy hány elem jelenjen meg egy oldalon
        // console.log(req.query.orderBy)

        db.serialize(() => {
            db.all('SELECT COUNT(*) AS total FROM products', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                }
                console.log(req.query);
                const totalItems = rows[0].total;
                const totalPages = Math.ceil(totalItems / limit);
                const offset = (page - 1) * limit;
                console.log(req.query, "query");
                const orderBy = req.query.orderBy !== 'null' ? req.query.orderBy : 'title';
                const order = req.query.order !== 'null' ? req.query.order : 'ASC';
                console.log(order)
                console.log(orderBy)
                db.run('PRAGMA foreign_keys=ON');
                db.all(`SELECT products.id, title, description, price, filename, images.id as img_id, path
                        FROM products
                        JOIN images ON products.id = images.product_id
                        GROUP BY products.id
                        ORDER BY ${orderBy} ${order} 
                        LIMIT ${limit} OFFSET ${offset}`
                    , (err, products) => {

                        if (err) {
                            console.error(err.message);
                            return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                        }
                        console.log("products", products)
                        res.json({ products, totalPages });
                    });
            });
        });
        // console.log("admin");
        // db.all('SELECT products.id, title, description, price, filename, images.id as img_id, path FROM products JOIN images ON products.id = images.product_id', (err, rows) => {
        //     if (err) {
        //         console.error(err.message);
        //         return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
        //     }
        //     else {
        //         return res.status(201).json({ products: rows });

        //         /* router.get("/products", (req, res, next) => {
        //             db.serialize(() => {
        //                 db.run('PRAGMA foreign_keys=ON');
        //                 db.all("SELECT products.id, title, description, price, filename, images.id as img_id, path FROM products JOIN images ON products.id = images.product_id", (err, rows) => {
        //                     if (err) {
        //                         console.log('Select error', err);
        //                         return;
        //                     } else {
        //                         res.json({ "data": rows }); */

        //     }
        // })
    }
    else {
        const page = parseInt(req.query.page) || 1;
        const limit = 8; // Meghatározzuk, hogy hány elem jelenjen meg egy oldalon
        // console.log(req.query.orderBy)

        db.serialize(() => {
            db.all('SELECT COUNT(*) AS total FROM products', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                }
                console.log(req.query);
                const totalItems = rows[0].total;
                const totalPages = Math.ceil(totalItems / limit);
                const offset = (page - 1) * limit;
                console.log(req.query, "query");
                const orderBy = req.query.orderBy !== 'null' ? req.query.orderBy : 'title';
                const order = req.query.order !== 'null' ? req.query.order : 'ASC';
                console.log(order)
                console.log(orderBy)
                db.run('PRAGMA foreign_keys=ON');
                db.all(`SELECT products.id, title, description, price, filename, images.id as img_id, path 
                        FROM products 
                        JOIN images ON products.id = images.product_id 
                        JOIN products_categories x ON products.id = x.product_id
                        JOIN categories ON categories.id = x.category_id
                        WHERE categories.name != 'special'
                        GROUP BY products.id
                        ORDER BY ${orderBy} ${order} 
                        LIMIT ${limit} OFFSET ${offset}`
                    , (err, products) => {

                        if (err) {
                            console.error(err.message);
                            return res.status(500).json({ error: 'Hiba történt a lekérdezés során.' });
                        }
                        console.log("products", products)
                        res.json({ products, totalPages });
                    });
            });
        });
    }
});

router.get("/product/:id", (req, res) => {
    const { id } = req.params;            //url-ben lévő dinamikus rész
    console.log(id);
    db.serialize(() => {
        const stmt = db.prepare(`
            SELECT products.id, title, description, price, filename, images.id as img_id, path FROM products 
            JOIN images ON products.id = images.product_id
            WHERE products.id =? `, id);    //JOIN product.id = images.product_id
        stmt.get((err, row) => {
            if (err) {
                console.log('error', err);
                res.send("id error")
            } else {
                console.log(row, "roducts row")

                const stmt2 = db.prepare(`
                    SELECT x.category_id, y.name FROM products_categories x
                    JOIN categories y ON x.category_id = y.id
                    WHERE x.product_id = ?
                    `, id);

                stmt2.all((err, categoryRows) => {
                    if (err) {
                        console.log('error', err);
                        res.send("id error")
                    } else {
                        console.log(categoryRows, "category row")
                        res.send({ "data": { ...row, categories: categoryRows } })
                    }
                })
            }
        })
    });
})

router.get("/product/special/:id", (req, res) => {
    const { id } = req.params;            //url-ben lévő dinamikus rész
    console.log(id, "id");
    db.serialize(() => {
        const stmt = db.prepare(` 
        SELECT y.id AS category_id, x.product_id, z.title, z.description, z.price, w.filename, w.id as img_id, w.path FROM categories y
        JOIN products_categories x  ON x.category_id = y.id
        JOIN products z ON x.product_id = z.id
        JOIN images w ON x.product_id = w.product_id
        WHERE y.name = ? `, id);

        stmt.get((err, row) => {
            if (err) {
                console.log('error', err);
                res.send("id error")
            } else {
                // console.log(row, "products row");
                //console.log(y.category_id)
                res.send({ "data": { ...row, categories: [{ category_id: row.category_id, name: id }] } })

            }
        })
    });
})


router.put("/products/:id", (req, res) => {
    const { id } = req.params;            //url-ben lévő dinamikus rész
    const { title, price, categoryId, description } = req.body;    //json adat amit küld a kliens

    console.log(req.body);

    db.serialize(() => {
        const stmt = db.prepare("SELECT * FROM products WHERE id =?", id);
        // az első stmt rész törölhető
        stmt.get((err, row) => {
            if (err) {
                console.log('error', err);
                res.send("id error")
            } else {
                console.log(row);
                if (row) {
                    const stmt2 = db.prepare("UPDATE products SET title=$title, description=$description, price=$price WHERE id=$id", {
                        $title: title,
                        $description: description,
                        $price: price,
                        $id: id
                    })
                    stmt2.run((err) => {
                        if (err) {
                            console.log('error', err)
                            res.send({ error: 'update error' })
                        } else {
                            db.serialize(() => {
                                db.run("DELETE FROM products_categories WHERE product_id = ?", id)
                                const stmt3 = db.prepare("INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)")
                                categoryId.forEach(cat => {
                                    stmt3.run(id, cat)
                                })
                                stmt3.finalize((err) => {
                                    if (err) {
                                        console.log('error', err)
                                        res.send({ error: 'update error' })
                                    } else {
                                        res.send({ title, price, id, categoryId })
                                    }
                                })

                            })
                        }
                    })
                } else {
                    res.send("no id")
                }
            }
        })
    });
})

router.delete("/products/:id", (req, res) => {
    const { id } = req.params;            //url-ben lévő dinamikus rész
    db.serialize(() => {
        const stmt2 = db.prepare("DELETE FROM products WHERE id=?", id)
        stmt2.run((err) => {
            if (err) {
                console.log('error', err)
                res.send({ error: "Sikertelen törlés" })
            } else {
                res.send({ message: "Sikeres törlés" })
            }
        })
    })
});


export default router;