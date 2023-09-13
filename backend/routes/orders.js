import express from 'express';
import sqlite3 from 'sqlite3';
import db from '../connection.js';
import { nanoid } from 'nanoid';
import { sessions } from '../constants.js';

sqlite3.verbose();
const router = express.Router();

router.post('/order', (req, res) => {
    console.log(req.body, "boody");
    const sessionid = req.cookies.sessionID;
    const userId = sessions[sessionid].localID;
    const orderId = nanoid(10);
    // const createdAt = Date.now();
    const statusInfo = "Megrendelés feldolgozás alatt";

    const sql1 = `INSERT INTO orders (order_id, created_at, status, extra_info, total_amount, user_id) VALUES (?, datetime('now', 'localtime'),?,?,?,?)`;
    const sql2 = 'INSERT INTO orders_products (order_id, product_id, quantity) SELECT ?, carts.product_id, carts.quantity FROM carts WHERE carts.user_id = ?';
    const sql3 = `INSERT OR REPLACE INTO billingaddress (surname, familyname, city, street, house_number, postal_code, user_id) 
        VALUES (?,?,?,?,?,?,?)`;
    const sql4 = `INSERT OR REPLACE INTO shippingaddress (surname, familyname, city, street, house_number, postal_code, user_id) 
    VALUES (?,?,?,?,?,?,?)`;
    const sql5 = `DELETE FROM carts WHERE carts.user_id = ?`;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION", err => { if(err) console.log("22:", err)})

        const stmt1 = db.prepare(sql1, orderId, statusInfo, req.body.extra_info, req.body.totalPrice, userId, (err) => console.log(err, "err"));
        stmt1.run(err => { if(err) db.run("ROLLBACK")});

        const stmt2 = db.prepare(sql2, orderId, userId);
        stmt2.run(err => { if(err) db.run("ROLLBACK")});

        const stmt3 = db.prepare(sql3, req.body.billAddress.surname, req.body.billAddress.familyname, req.body.billAddress.city, req.body.billAddress.street, req.body.billAddress.house_number, req.body.billAddress.postal_code, userId,  (err) => console.log(err, "err"));
        stmt3.run(err => { if(err) db.run("ROLLBACK")});

        const stmt4 = db.prepare(sql4, req.body.shippingAddress.surname, req.body.shippingAddress.familyname, req.body.shippingAddress.city, req.body.shippingAddress.street, req.body.shippingAddress.house_number, req.body.shippingAddress.postal_code, userId, (err) => console.log(err, "err"));
        stmt4.run(err => { if(err) db.run("ROLLBACK")});
        stmt4.finalize()

        const stmt5 = db.prepare(sql5, userId);
        stmt5.run(err => { if(err) db.run("ROLLBACK")})

        db.run("COMMIT", err =>{
            console.log("21:", err)
            if(!err) res.status(201).json({id: orderId})
            else res.status(400).json({error: "Sikertelen megrendelés"})
            })
    })
})


// router.post('/order', (req, res) => {
//     const sessionid = req.cookies.sessionID;
//     const userId = sessions[sessionid].localID;
//     const orderId = nanoid(10);
//     const createdAt = Date.now();
//     console.log("sessionid", sessionid)
//     console.log("userId:", userId);
//     const statusInfo = "Megrendelés feldolgozás alatt";

//     db.serialize(() => {
//         const stmt = db.prepare(`INSERT INTO orders (order_id, created_at, status, extra_info, total_amount, user_id) VALUES (?,?,?,?,?,?)`,
//             orderId, createdAt, statusInfo, req.body.extra_info, req.body.totalPrice, userId);
//         stmt.run((err) => {
//             if (err) {
//                 console.log(err);
//                 res.json({ mess: "Order hiba" })
//             } else {
//                 const stmt2 = db.prepare(`
//                     INSERT INTO orders_products (order_id, product_id, quantity) 
//                     SELECT ?, carts.product_id, carts.quantity FROM carts WHERE carts.user_id = ${userId}
                        
//                     `, orderId)
//                 stmt2.run((err) => {
//                     if (err) {
//                         console.log("orderitmes:", err);
//                         res.json({ mess: "prod order hiba" })
//                     } else {
//                         const stmt3 = db.prepare(`DELETE FROM carts WHERE carts.user_id = ${userId}`)
//                         stmt3.run((err) => {
//                             if (err) {
//                                 console.log('error', err)
//                                 res.send("delete error")
//                             } else {
//                                 res.send("Products ordered.")
//                             }
//                         })

//                     }
//                 })


//             }
//         });




//     })
// })

router.post('/billingaddress', (req, res) => {
    const sessionid = req.cookies.sessionID;
    const userId = sessions[sessionid].localID;


    db.serialize(() => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO billingaddress (surname, familyname, city, street, house_number, postal_code, user_id) 
            VALUES (?,?,?,?,?,?,?)`,
            req.body.surname, req.body.familyname, req.body.city, req.body.street, req.body.house_number, req.body.postal_code, userId)
        stmt.run((err) => {
            if (err) {
                console.log("billingaddress:", err);
                res.json({ mess: "hiba" })
            } else {
                res.send("billingaddress Ok")
            }
        })
    })

})

router.post('/shippingaddress', (req, res) => {
    const sessionid = req.cookies.sessionID;
    const userId = sessions[sessionid].localID;


    db.serialize(() => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO shippingaddress (surname, familyname, city, street, house_number, postal_code, user_id) 
            VALUES (?,?,?,?,?,?,?)`,
            req.body.surname, req.body.familyname, req.body.city, req.body.street, req.body.house_number, req.body.postal_code, userId)
        stmt.run((err) => {
            if (err) {
                console.log("shippingaddress:", err);
                res.json({ mess: "hiba" })
            } else {
                res.send("shippingaddress Ok")
            }
        })
    })

})

//admin összes megrendelés listázása

router.get("/orders", (req, res) => {
    db.serialize(() => {
        //db.run('PRAGMA foreign_keys=ON');
        db.all(`SELECT order_id, created_at, status FROM orders`, (err, rows) => {
            if (err) {
                console.log('Select error', err);
                return;
            } else {
                res.json({ "data": rows });
            }
        })
    })
})

router.get("/orders/:orderId", (req, res) => {
    const { orderId } = req.params;
    db.serialize(() => {

        db.run('PRAGMA foreign_keys=ON');
        db.all(`
        SELECT x.order_id, x.created_at, x.status, x.extra_info, x.total_amount, w.surname, w.familyname, w.city, w.street, w.house_number, w.postal_code, w.user_id, v.surname AS sh_surname, v.familyname AS sh_familyname, v.city AS sh_city, v.street AS sh_street, v.house_number AS sh_house_number, v.postal_code AS sh_postal_code, v.user_id AS sh_user_id, y.product_id, y.quantity, z.description, z.title, z.price, i.path  
        FROM orders x 
        JOIN billingaddress w ON x.user_id = w.user_id  
        JOIN shippingaddress v ON x.user_id = v.user_id
        JOIN orders_products y ON x.order_id = y.order_id 
        JOIN products z ON y.product_id = z.id 
        JOIN images i ON z.id = i.product_id
        WHERE x.order_id = ?
        GROUP BY y.product_id
        `, orderId, (err, rows) => {
            if (err) {
                console.log('Select error', err);
                res.json({ error: "error" });
            } else {
                console.log("rows:", rows)
                res.json(rows);

            }
        })
    })
})


router.get("/userorders/:userId", (req, res) => {
    const { userId } = req.params;
    db.serialize(() => {

        db.run('PRAGMA foreign_keys=ON');
        db.all(`
        SELECT x.order_id, x.created_at, x.status, x.extra_info, x.total_amount, w.surname, w.familyname, w.city, w.street, w.house_number, w.postal_code, w.user_id, v.surname AS sh_surname, v.familyname AS sh_familyname, v.city AS sh_city, v.street AS sh_street, v.house_number AS sh_house_number, v.postal_code AS sh_postal_code, v.user_id AS sh_user_id, y.product_id, y.quantity, z.description, z.title, z.price  
        FROM orders x 
        JOIN billingaddress w ON x.user_id = w.user_id  
        JOIN shippingaddress v ON x.user_id = v.user_id
        JOIN orders_products y ON x.order_id = y.order_id 
        JOIN products z ON y.product_id = z.id 
        WHERE x.user_id = ?
        GROUP BY x.order_id
        `, userId, (err, rows) => {
            if (err) {
                console.log('Select error', err);
                res.json({ error: "error" });
            } else {
                console.log("userorders rows:", rows)
                res.json(rows);

            }
        })
    })
})

router.patch("/orders/:orderId", (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    db.serialize(() => {
        const stmt = db.prepare(`UPDATE orders SET status=$status  WHERE order_id = $orderId`, {
            $status: status,
            $orderId: orderId
        })
        stmt.run((err) => {
            if (err) {
                console.log('error', err)
                res.json({error: 'Sikertelen státusz módosítás!'})
            } else {
                res.json({ orderId })
            }
        })
    })
})

//user profile oldal
router.get("/orders/:user_id", (req, res) => {
    const { userId } = req.params;
    db.serialize(() => {

        db.run('PRAGMA foreign_keys=ON');
        db.all(`SELECT order_id, created_at, status FROM orders JOIN orders_products WHERE orders.user_id = ${userId}`, (err, rows) => {
            if (err) {
                console.log('Select error', err);
                return;
            } else {
                res.json({ "data": rows });
            }
        })
    })
})

router.delete("/orders/:id", (req, res) => {
    const { id } = req.params;
    console.log("delete req.param-ból id:", id);

    db.serialize(
        () => {
            const stmt = db.prepare(`DELETE FROM orders WHERE order_id = ?`, id);

            stmt.run((err) => {
                if (err) {
                    console.log('error', err);
                    res.json({error: "Sikertelen törlés!"})
                } else {
                    res.json({id})
                }
            })

            /*const stmt2 = db.prepare(`DELETE FROM  orders_products WHERE order_id = ? `, id);

            stmt2.run((err) => {
                if (err) {
                    console.log('error', err)
                    res.send("orders_prod table delete error")
                } else {
                    res.send(" orders delete ok")
                }
            })*/

        })
})


export default router;