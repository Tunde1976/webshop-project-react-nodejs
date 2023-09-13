export {}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Products = require('backend/routes/products.js');

const app = express();
const port = 8000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

router.get('/products', async (req, res) => {
    // destructure page and limit and set default values
    const { page = 1, limit = 12 } = req.query;
  
    try {
      // execute query with page and limit values
      const products = await Products.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      // get total documents in the Posts collection 
      const count = await Products.count();
  
      // return response with posts, total pages, and current page
      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
  });