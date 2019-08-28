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

mongoose.connect("mongodb://localhost:27017/contactUsDB",{useNewUrlParser: true});

//mongoose.connect("mongodb+srv://anand:unicornb1331@cluster0-0tquo.mongodb.net/contactUsDB?retryWrites=true&w=majority");

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

const studentSchema = new mongoose.Schema({
    name: String,
    roll: String,
    admn: String,
    college: String,
    branch: String,
    dob: String,
    email: String
    
});

const studentCollection = new mongoose.model("studentDetails", studentSchema);

//////////////////////// Write to DB//////////////////////////////
app.post("/writeToDB",(req,res)=>{
    const userContact = new contactUsCollection(req.body);
    userContact.save((error)=>{
        if(error){
            console.log(error);
        }else{
            console.log("User Contact Added Successfully");
            res.json("{'status':'success'}");
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
app.post("/searchMobile",(req,res)=>{
    var name = req.body.name;
    contactUsCollection.find({name: name},(error,data)=>{
        if (error){
            console.log(error);
        } else {
            res.send(data);
        }
    });
});

///////////////////////////// Delete contact /////////////////////////////
app.post("/deleteUser",(req,res)=>{
    var name = req.body.name;
    contactUsCollection.remove({name:name},(error)=>{
        if(!error) {
            console.log("Contact Deleted successfully");
        } else {
            console.log(error);
        }
    });
});

///////////////////////////Edit Contact///////////////////////////////////
app.post("/editUser",(req,res)=>{
    var id = req.body._id;
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var message = req.body.message;
    console.log(id);
   
    contactUsCollection.update({_id: id},{$set: {name: name, email: email, mobile: mobile,message: message }},(error)=>{
        if (!error) {
            console.log("Updated successfully");
            res.send("updated successfully");
        } else {
            console.log(error);
        }
    });
         
    
});

///////////////////////////////////Delete contact/////////////////////
app.post("/deleteContact",(req,res)=>{
    var id = req.body._id;
    console.log(id);

    contactUsCollection.remove({_id:id},(error)=>{
        if(!error) {
            console.log("Deleted Successfully");
        } else {
            console.log(error);
        }
    });
});


//////////////////////////////////////////////Student write to db/////////////////////
app.post("/AddStudent",(req,res)=>{
    const student = new studentCollection(req.body);
    student.save((error)=>{
        if (error){
            console.log(error);
        } else {
            res.send("Student Added Successfully");
            console.log("Student Added Successfully");
        }
    });

});

//////////////////////////////////////////////View all Students///////////////////////////
app.get("/viewAllStudents",(req,res)=>{
    studentCollection.find((error,data)=>{
        if (error) {
            console.log(error);
        } else {
            res.send(data);
        }
    });
});

///////////////////////////////////////////Search student Using Admin No////////////
app.post("/searchStudent",(req,res)=>{
    var x = req.body.admn;
    studentCollection.find({admn: x},(error,data)=>{
        if(error) {
            console.log(error);
        } else {
            res.send(data);
        }
    })
})

//////////////////////////////////////////Edit Student using Admin No//////////////////////
app.post("/editStudent",(req,res)=>{
    var a = req.body.admn;
    var n = req.body.name;
    var r = req.body.roll;
    var c = req.body.branch;
    var d = req.body.dob;
    var e = req.body.email;
    studentCollection.update({admn: a},{$set: {name: n, roll: r, college: c, dob: d, email: e}},(error)=>{
        if (!error) {
            console.log("Updated successfully");
            res.send("updated successfully");
        } else {
            console.log(error);
        }
    });
           
})


//////////////////////////////////////////delete student/////////////////////////////
app.post("/deleteStudent",(req,res)=>{
    var delstud = req.body.admn;
    studentCollection.remove({damin:delstud},(error)=>{
        if(!error){
            console.log("deleted successfully");
        } else {
            console.log(error);
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