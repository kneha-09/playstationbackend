const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;
const Mongo = require("mongodb"); // You might not need this line, as you're using Mongoose
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectMongoose } = require('./controller/dbController'); 
const {  connectMongoDB,
    getData,
    postData,
    updateOrder,
    deleteOrder } = require('./controller/db'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authenticateToken = require('./middleware/authenticateToken');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.get('/', (req, res) => {
    res.send('Api is Running')
})


app.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        // console.log('User Detailes', req.body)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', data:newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        user.tokens.push(token);
        await user.save();       
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        // console.log(req.user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone:user.phone,
        };
        res.json(userData);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/protected', authenticateToken, (req, res) => {
    const user = req.user;
    res.json({ message: 'Protected route accessed successfully', user });
});


//page 1
app.get('/category', async (req, res, next) => {
    try {
        let query = {};
        let collection = "category";
        let output = await getData(collection, query);
        res.send(output);
    } catch (err) {
        console.error("An error occurred:", err); // Logging the error
        next(err); // Passing the error to the next middleware (global error handler)
    }
});

app.get("/shoppingItem", async (req, res) => {
    let query = {};
    let collection = "shoppingItem";
    let output = await getData(collection, query);
    res.send(output)
})

//page 2
//get all one type item eg
app.get("/categoryItem", authenticateToken, async (req, res) => {
    let query = {};
    if (req.query.categoryId && req.query.subCategoryId) {
        query = { categoryId: Number(req.query.categoryId), "subCategory.subCategoryId": Number(req.query.subCategoryId) }
    }
    else if (req.query.categoryId) {
        query = { categoryId: Number(req.query.categoryId) }

    }
    else {
        query = {}
    }
    let collection = "item";
    let output = await getData(collection, query);
    res.send(output)
})
app.get("/gameIdProduct", authenticateToken, async (req, res) => {
    let query = {};
    if ( req.query.playableDeviceId && req.query.genreId) {
        query = {"playableDevice.playableDeviceId": Number(req.query.playableDeviceId) ,"Genre.genreId": Number(req.query.genreId) }
    }
    else if ( req.query.playableDeviceId) {
        query = {"playableDevice.playableDeviceId": Number(req.query.playableDeviceId) }
    }
    else if (req.query.genreId) {
        query = {  "Genre.genreId": Number(req.query.genreId) }
    }
    else if (req.query.gameId) {
        query = { gameId: Number(req.query.gameId) }

    }
    else {
        query = {}
    }
    let collection = "gameData";
    let output = await getData(collection, query);
    res.send(output)
})
// for game option
app.get("/products", authenticateToken, async (req, res) => {
    let query = {};

    if (req.query.shoppingCategoryId && req.query.productId) {
        query = { shoppingCategoryId: Number(req.query.shoppingCategoryId), "products.productId": Number(req.query.productId) }
    }
    else if (req.query.shoppingCategoryId) {
        query = { shoppingCategoryId: Number(req.query.shoppingCategoryId) }
    }
    else {
        query = {}
    }
    let collection = "shoppingItem";
    let output = await getData(collection, query);
    res.send(output)
})


//page 3
app.get('/details/:id', authenticateToken, async (req, res) => {
    let id = new Mongo.ObjectId(req.params.id)
    let query = { _id: id }
    let collection = "item";
    let output = await getData(collection, query);
    res.send(output)
}) 
app.get('/menuitem/:id', authenticateToken, async(req,res) => {
    let id = Number(req.params.id);
    let query = {categoryId:id};
    let collection = "item";
    let output = await getData(collection,query);
    res.send(output)
})
app.get('/shoppingProduct/:id',authenticateToken, async (req, res) => {
    let id = Number(req.params.id);
    let query = { shoppingCategoryId: id };
    let collection = "shoppingItem";
    let output = await getData(collection, query);
    res.send(output)
})



// page 4
//product details {"id":[4,8,21]}
app.post('/productDetails', authenticateToken, async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {id:{$in:req.body.id}};
        let collection = 'item';
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('Please Pass data in form of array')
    }
}) 
app.post('/placeOrder', authenticateToken, async (req, res) => {
    let data = req.body;
    let collection = "orders";
    // console.log(">>>", data)
    let response = await postData(collection, data)
    res.send(response)
})


// page 5//orders
app.get('/orders', authenticateToken, async (req, res) => {
    let query = {};
    if (req.query.email) {
        query = { email: req.query.email }
    } else {
        query = {}
    }
    let collection = "orders";
    let output = await getData(collection, query);
    res.send(output)
})

//update
app.put('/updateOrder', authenticateToken, async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

//delete order
app.delete('/deleteOrder', authenticateToken, async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})




app.listen(port, (err) => {
    connectMongoose();  
    connectMongoDB();  
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
});