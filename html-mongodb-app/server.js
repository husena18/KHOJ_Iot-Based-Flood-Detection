const { name } = require('ejs');
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = 3019

const app = express();
app.use(express.static(__dirname))
app.use(express.urlencoded({extended : true}))

mongoose.connect('mongodb://127.0.0.1:27017/SMSsignup')
const db = mongoose.connection
db.once('open',() =>{
console.log("MongoDB connection successful")
})

const userSchema = new mongoose.Schema({
    name:String,
    number: String,
    address:String,
})

const Users = mongoose.model('data',userSchema)

app.get('/',(req,res)=> {
    res.sendFile(path.join(__dirname,'index.html'))
})

app.post('/post', async (req, res) => {
    const { name, phone, address } = req.body;
    const user = new Users({
        name,
        number: phone,  // Use 'phone' as the field in the form
        address,
    });

    try {
        await user.save();
        res.send("Form Submitted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting the form");
    }
});



app.listen(port,() => {
    console.log("Server started")
})