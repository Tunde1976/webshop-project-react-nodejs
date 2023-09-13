import db from './connection.js';


function createTables(){
   db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY, 
                email VARCHAR(32) UNIQUE NOT NULL, 
                password VARCHAR(32) NOT NULL, 
                isAdmin BOOLEAN NOT NULL
            )`,
        (err) => {
            if (err) {
                console.log('Users table creation error:', err);
            } else {
                console.log('Users table created')
            }
        }
    );
    db.run(`CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(32) PRIMARY KEY,  
                title VARCHAR(32) UNIQUE NOT NULL, 
                description TEXT, 
                price INT NOT NULL
            )`,
        (err) => {
        if (err) {
            console.log('Products table creation error:', err);
        } else {
            console.log('Products table created')
        }
    });
    db.run(`CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY, 
                name VARCHAR(32) UNIQUE NOT NULL 
            )`, 
        (err) => {
        if (err) {
            console.log('Categories table creation error:', err);
        } else {
            console.log('Categories table created')
        }
    });
    db.run(`CREATE TABLE IF NOT EXISTS carts (
                user_id INTEGER, 
                product_id VARCHAR(32), 
                quantity INTEGER, 
                FOREIGN KEY (user_id) REFERENCES users(id) , 
                FOREIGN KEY(product_id) REFERENCES products(id) , 
                PRIMARY KEY(user_id, product_id))`,
        (err) => {
        if (err) {
            console.log('Carts table creation error:', err);
        } else {
            console.log('Carts table created')}
    });
    db.run(`CREATE TABLE IF NOT EXISTS orders_products (
                order_id VARCHAR(32), 
                product_id VARCHAR(32), 
                quantity INTEGER, 
                FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE , 
                FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE , 
                PRIMARY KEY(order_id, product_id))`, (err) => {
        if (err) {
            console.log('Ordered Products table creation error:', err);
        } else {
            console.log('Ordered Products table created')}
    });

    db.run(`CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY, 
                filename VARCHAR(32), 
                path VARCHAR(32) UNIQUE NOT NULL, 
                product_id VARCHAR(32), 
                FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE 
            )`, 
        (err) => {
        if (err) {
            console.log('Images table creation error:', err);
        } else {
            console.log('Images table created')
        }
    })
    
    db.run(`CREATE TABLE IF NOT EXISTS orders (
                order_id VARCHAR(32) PRIMARY KEY, 
                created_at TEXT VARCHAR(32), 
                status VARCHAR(32),
                extra_info VARCHAR(100), 
                total_amount INTEGER, 
                user_id INTEGER, 
                FOREIGN KEY (user_id) REFERENCES users(id)
        )`, 
        (err) => {
        if (err) {
            console.log('Orders table creation error:', err);
        } else {
            console.log('Orders table created')}
    });

    db.run(`CREATE TABLE IF NOT EXISTS billingaddress (
                surname VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                familyname VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                city VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                street VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                house_number INTEGER NOT NULL ON CONFLICT ROLLBACK, 
                postal_code INTEGER NOT NULL ON CONFLICT ROLLBACK, 
                user_id INTEGER PRIMARY KEY ON CONFLICT ROLLBACK, 
                FOREIGN KEY (user_id) REFERENCES users(id) 
            )`, 
        (err) => {
        if (err) {
            console.log('Billing Address table creation error:', err);
        } else {
            console.log('Billing Address table created')}
    });

    db.run(`CREATE TABLE IF NOT EXISTS shippingaddress (
                surname VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                familyname VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                city VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                street VARCHAR(32) NOT NULL ON CONFLICT ROLLBACK, 
                house_number INTEGER NOT NULL ON CONFLICT ROLLBACK, 
                postal_code INTEGER NOT NULL ON CONFLICT ROLLBACK, 
                user_id INTEGER PRIMARY KEY ON CONFLICT ROLLBACK, 
                FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED
            )`, 
        (err) => {
        if (err) {
            console.log('Shipping Address table creation error:', err);
        } else {
            console.log('Shipping Address table created')}
    });
    
    db.run(`CREATE TABLE IF NOT EXISTS products_categories (
            product_id VARCHAR(32),
            category_id INTEGER,
            PRIMARY KEY (product_id, category_id),
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED
            )`, (err) => {
        if (err) {
            console.log('Products_categories table creation error:', err);
        } else {
            console.log('Products_categories table created')
        }
    });
}); 
        // db.run("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY, filename VARCHAR(32), path VARCHAR(32) UNIQUE NOT NULL, product_id VARCHAR(32), FOREIGN KEY(product_id) REFERENCES products(id))", (err) => {
        //     if (err) {
        //         console.log('Images table creation error:', err);
        //     } else {
        //         console.log('Images table created')
        //     }
        // });

    db.close;
}

export default createTables;