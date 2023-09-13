import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import routerProducts from './routes/products.js';
import routerCategories from './routes/categories.js';
import createTables from './databaseInit.js';
import cookieParser from 'cookie-parser';
import routerUsers from './routes/users.js'
import  routerCarts from './routes/carts.js';
import routerOrders from './routes/orders.js';
import multer from "multer";


sqlite3.verbose();

const app = express();
app.listen(8000, () => console.log("server started"));

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials: true, 
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"]
}));
app.use(express.urlencoded({ extended: true }));


createTables();
app.use('/api', routerProducts);
app.use('/api', routerCategories);
app.use(routerUsers);
app.use('/api', routerCarts);
app.use('/api', routerOrders);