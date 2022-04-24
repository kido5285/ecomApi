require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/orders');
const stripeRoute = require('./routes/stripe');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('db connection successful');
}).catch(e => {
    console.error(e);
})

const middleGuy = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers', '*'
    );
    next();
  }

app.use(cors());
app.use(express.json());
app.use('/api/users', middleGuy, userRoute);    
app.use('/api/auth', middleGuy, authRoute);    
app.use('/api/products', middleGuy, productRoute);
app.use('/api/cart', middleGuy, cartRoute);
app.use('/api/orders', middleGuy, ordersRoute);
app.use('/api/checkout', middleGuy, stripeRoute);

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
})