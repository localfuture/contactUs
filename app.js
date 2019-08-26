const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//mongoose.connect("mongodb://localhost:27017/contactUsDB",{useNewUrlParser: true});

mongoose.connect("mongodb+srv://anand:unicornb1331@cluster0-0tquo.mongodb.net/contactUsDB?retryWrites=true&w=majority");

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    message: String
});

const contactUsCollection = new mongoose.model("contactUsDetails",contactSchema);


//////////////////////// Write to DB//////////////////////////////
app.post("/writeToDB",(req,res)=>{
    const userContact = new contactUsCollection(req.body);
    userContact.save((error)=>{
        if(error){
            console.log(error);
        }else{
            console.log("User Contact Added Successfully");
        }
    });
});

////////////////////////// View Messages //////////////////////////
app.get("/displayMessages",(req,res) =>{
    contactUsCollection.find({},{message:1,_id:0},(error,data)=>{
        if(error){
            console.log(error);
        }else{
            res.send(data);
        }
    });
});

var displayMessages = "http://localhost:3000/displayMessages";

//////////////////////////// Search Phone Number /////////////////////
app.get("/searchMobile/:name",(req,res)=>{
    var name = req.params.name;
    contactUsCollection.find({name: name},{name:1,mobile:1,_id:0},(error,data)=>{
        if (error){
            console.log(error);
        } else {
            res.send(data);
        }
    });
});

//////////////////////////////////////////////////////////////////////
app.get("/",(req,res)=>{
    res.send("hello");
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server Is Listening");
});