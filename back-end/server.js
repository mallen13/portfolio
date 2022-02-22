//imports, setup, vars
const express = require('express');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const { handlePost } = require('./controller.js');
require('dotenv').config();

//setup express
const app = express();
const port = 8080;

//setup rate limiter
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes (first #)
    max: 20// limit each IP to 10 requests per windowMs
});

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get('/api/status', (req,res) => res.send('API is working'));

app.post('/api/send-message', (req,res) => handlePost(req,res));

//listen
app.listen(port, () => { console.log(`App listening at http://localhost:${port}`)});
