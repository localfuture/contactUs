const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


//mongoose.connect("mongodb://localhost:27017/contactUsDB",{useNewUrlParser: true});

mongoose.connect("mongodb+srv://anand:unicornb1331@cluster0-0tquo.mongodb.net/contactUsDB?retryWrites=true&w=majority");

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    message: String
});

const contactUsCollection = new mongoose.model("contactUsDetails",contactSchema);

const registerSchema = new mongoose.Schema({
    name: String,
    gender: String,
    dob: String,
    address: String,
    city: String,
    district: String,
    mobile: String,
    email: String,
    username: String,
    password: String,
    confirmpassword: String

});

const registerCollection = new mongoose.model("registerDetails", registerSchema);

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
//////////////////////////// Register write to DB//////////////////
app.post("/writeRegisterToDB",(req,res)=>{
    const registerUser = new registerCollection(req.body);
    registerUser.save((error)=>{
        if(error){
            console.log(error);
        }else {
            res.send("Registered Successfully");
        }
    });
});

////////////////////////// View Messages //////////////////////////
app.get("/displayMessages",(req,res) =>{
    contactUsCollection.find((error,data)=>{
        if(error){
            console.log(error);
        }else{
            res.send(data);
        }
    });
});


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