const express =require("express")
const app=express();
const path=require("path")
const hbs=require("hbs")
const session=require("express-session")
const userRoute=require("./server/routes/user_route")
const adminRoute=require("./server/routes/admin_route");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();




// route.use(session({
//   secret: 'idkhudebsdhbedbbdejsdnjncantfindme',
//   resave: false,
//   saveUninitialized: false,
 
//   // cookie: { maxAge: 24*60*60*7*4 }

//   cookie: {
//       httpOnly: true,
//       maxAge: 1*60*60*1000
//     }
// }))


 


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/",userRoute)
app.use("/admin",adminRoute)
app.use(express.static(path.join(__dirname, 'public')));

// app.use("public/images",express.static('public/images'))




app.use(express.static('public'));



// PARTIALS FOR USER
const userPartialsPath=path.join(__dirname, 'views/partials')
hbs.registerPartials(userPartialsPath);




//multiply the quantity withw the total
hbs.registerHelper('multiply', function (a, b) {
  return a * b;
});

//Date
hbs.registerHelper('formatDate', function (date) {
    return new Date(date).toDateString();
  });

// code to check if the string is equal or note in hbs
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('ifNotEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.inverse(this) : options.fn(this);
});

//PARTIALS FOR ADMIN
// const adminPartialsPath=path.join(__dirname,'views/admin')
// hbs.registerPartials(adminPartialsPath)

//PATH FOR VIEWS
app.set("view engine","hbs")
app.set('views',[
path.join(__dirname,'views/user'),
path.join(__dirname,'views/admin')
])
// app.set("views",path.join(__dirname,'views/user'))
// app.set("views",path.join(__dirname,'views/admin'))




app.listen(4000) 
      