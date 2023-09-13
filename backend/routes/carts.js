import express from 'express';
import sqlite3 from 'sqlite3';
import db from '../connection.js';
import { sessions } from '../constants.js';

sqlite3.verbose();
const router = express.Router();


router
    .route("/cart/:productid")
    .delete((req, res) => {
        const { productid } = req.params;
        const sessionid = req.cookies.sessionID
        const user_id = sessions[sessionid].localID
        db.serialize(() => {
            const stmt2 = db.prepare("DELETE FROM carts WHERE user_id=$user_id AND product_id=$product_id", {
                $user_id: user_id,
                $product_id: productid
            })
            stmt2.run((err) => {
                if (err) {
                    res.json({ mess: "hiba" })
                } else {
                    res.send({ productid })
                }
            })
        })
    })
    .put((req, res) => {
        const { productid } = req.params;
        const sessionid = req.cookies.sessionID
        const user_id = sessions[sessionid].localID
        const {quantity}=req.body;
        console.log(req.body, "req.body");
        db.serialize(() => {
            const stmt = db.prepare("UPDATE carts SET quantity=$quantity WHERE user_id=$user_id AND product_id=$product_id", {
                $user_id: user_id,
                $product_id: productid,
                $quantity: quantity
            })
            stmt.run((err) => {
                if (err) {
                    console.log('error', err)
                    res.send("update error")
                } else {
                    res.send({ user_id, productid, quantity }) // válasz 2 id és a kosárban lévő mennyiség vissza, és azt FE-n is beletenni a kosárba, hogy frissüljön
                }
            })
        })
    })


router
    .route("/cart")
    .put((req, res) => {
        const { user_id } = req.body;
        const { product_id } = req.body;
        let quantity;
        console.log(req.body);
        db.serialize(() => {
            const stmt1 = db.prepare("SELECT * FROM carts WHERE user_id=$user_id AND product_id=$product_id", {
                $user_id: user_id,
                $product_id: product_id
            })
            stmt1.get((err, row) => {
                console.log(row, "cart row");
                if (err) {
                    console.log('error', err)
                    res.send("select cart error")
                }
                if (!row) {
                    quantity = 1;
                    const stmt2 = db.prepare("INSERT INTO carts (user_id,product_id,quantity) VALUES (?,?,?)", user_id, product_id, quantity);
                    stmt2.run((err) => {
                        if (err) {
                            console.log('error', err)
                            res.send("update error")
                        } else {
                            res.send({ user_id, product_id, quantity }) // válasz 2 id és a kosárban lévő mennyiség vissza, és azt FE-n is beletenni a kosárba, hogy frissüljön
                        }
                    })
                } else {
                    quantity = row.quantity + 1;
                    const stmt3 = db.prepare("UPDATE carts SET quantity=$quantity WHERE user_id=$user_id AND product_id=$product_id", {
                        $user_id: user_id,
                        $product_id: product_id,
                        $quantity: quantity
                    })
                    stmt3.run((err) => {
                        if (err) {
                            console.log('error', err)
                            res.send("update error")
                        } else {
                            res.send({ user_id, product_id, quantity }) // válasz 2 id és a kosárban lévő mennyiség vissza, és azt FE-n is beletenni a kosárba, hogy frissüljön
                        }
                    })
                }

            })
        })
    })



    /* .delete ((req, res) => {
    const { user_id } = req.body;
    const { product_id } = req.body;
    db.serialize(() => {
        const stmt2 = db.prepare("DELETE FROM carts WHERE user_id=$user_id and product_id=$product_id", {
            $user_id: user_id,
            $product_id: product_id
        })
        stmt2.run((err) => {
            if (err) {
                res.json({ mess: "hiba" })
            } else {
                res.json({ user_id, product_id })
            }
        })
    })
}) */

    .get((req, res) => {
        console.log(req.cookies.sessionID, "request session")
        console.log(sessions)
        const sessionid = req.cookies.sessionID
        const user_id = sessions[sessionid].localID

        db.serialize(() => {
            const stmt = db.prepare(`
                SELECT  products.id as product_id, products.title, products.price, carts.quantity , (carts.quantity * products.price) AS subtotal FROM carts JOIN products ON products.id=carts.product_id WHERE carts.user_id=?`
                , user_id)
            stmt.all((err, rows) => {
                if (err) {
                    console.error("get carts", err);
                    res.status(500).json({ error: "Adatbázis hiba" });
                } else {
                    const stmt2=db.prepare(`SELECT SUM(carts.quantity * products.price) AS totalprice FROM carts JOIN products ON products.id=carts.product_id WHERE carts.user_id=? GROUP BY carts.user_id `
                    , user_id)
                    stmt2.get((err, row)=>{
                    if(err){
                        console.error("totalprice err", err);
                        res.status(500).json({ error: "Adatbázis hiba" });
                    } else{
                      console.log(row);
                    res.json({lineItems: rows, ...row});   
                      
                    }   
                })
                    
                }
            })


        })
    })

export default router;