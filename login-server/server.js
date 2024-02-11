const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('./models/user.model');

const app = express();

var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            email: req.body.email,
            password: hash
        });

        await user.save();

        res.status(200).json({
            message: "User registered"
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to register user' })
    }
});

app.post('/api/login', async (req, res) => {
    try {
        console.log(req.body);

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            console.log("No such user in db");
            return res.status(401).json({
                message: "Authorization failed"
            });
        }
        
        const verified = await bcrypt.compare(req.body.password, user.password);

        if (verified) {
            const token = jwt.sign({ email: req.body.email, userId: user._id }, `${process.env.SK}`);
            res.status(200).json({
                token: token,
                userId: user._id
            });
        } else {
            res.status(401).json({ message: 'Authorization failed' });
        }

    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Authorization failed' });
    }
});

async function connectToDatabase() {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@login-db:27017/users-db?authSource=admin`, { useNewUrlParser: true });
        console.log('Connected to MongoDB successfully');
        app.listen(3000);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
  
connectToDatabase();