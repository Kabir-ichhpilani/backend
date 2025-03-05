
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const port = 4040;

app.listen(port,(req,res)=>{
    console.log(`Server is running on port ${port}`);
})
app.get("/",(req,res)=>{
    res.send("Hello World");
})