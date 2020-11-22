var express = require("express");
var path = require("path");
var multer = require("multer");
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const exhbs = require('express-handlebars');
const mongoose = require("mongoose");
const { arch } = require("os");
const db = require('../web322_assign_1/models/user');
const uri = "mongodb+srv://dbUser:pass@cluster0.jucej.mongodb.net/web322?retryWrites=true&w=majority";
const addUser = require('../web322_assign_1/controller/addUser');
//Express Connection
var app = express();
var PORT = process.env.PORT || 3000;
app.engine('.hbs', exhbs({ extname: '.hbs' }));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', '.hbs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/src"));
app.use(express.static(__dirname + "/img"));

//Mongoose Connection
mongoose.connect(uri,{useNewUrlParser: true},{useUnifiedTopology: true})
.then(() =>  console.log('MongoDB connected...'))
.catch(err => console.log(err));

//User Controller


//GET Routes
app.get("/", function(req,res){
    res.render('index',{
        layout: false
    });
});
app.get("/rooms", function(req,res){
    res.render('rooms',{
        layout:false
    });
});
app.get("/register", function(req,res){
    res.render('register',{
        layout:false
    });
});
//POST Routes
// app.post("/add-user", function(req,res){
//   console.log(req.body);
//   res.redirect('/register');
// });

//Registration mailing
const storage = multer.diskStorage({
    destination: "",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: 'adevakumar1web322@gmail.com',
        pass: '159076199'
    }
  });

  app.post("/register",upload.single(''),(req, res) => {

    const FORM_FILE = req.file;
    const FORM_DATA = req.body;



  var mailOptions = {

    from: 'adevakumar1web322@gmail.com',
    to: FORM_DATA.email,
    subject: 'Test email from NODE.js using nodemailer',
    html: '<p>Hello ' + FORM_DATA.First + ":</p><p>Thank-you for contacting us.</p>"

}

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.log("ERROR: " + error);
  } else {
      console.log("SUCCESS: " + info.response);
  }
});


app.get('/register', function(req, res){

  var someData = {
   fname: FORM_DATA.First

  }
  res.render('register', {
  data: someData, layout: false});
});


res.writeHead(302, {
  'Location': '/register'
});
res.end();
});
app.use('/', addUser);
app.listen(PORT,function(){
    console.log(`🌎 ==> Server listening now on port ${PORT}!`);
});

