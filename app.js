require("dotenv").config();
   
console.log("Cloud:", process.env.CLOUD_NAME);

 const express = require("express");
 const app = express();
const mongoose = require("mongoose");
const ejsMate= require("ejs-mate");
const path = require("path");
const methodOverride =require("method-override")
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo').default || require('connect-mongo');

const flash = require("connect-flash");

const passport =require("passport");
const LocalStrategy =require("passport-local");//localstrategy means normal login authentiaction na ki github etc
//  ka login credential istemal kare. 
const User = require("./models/user.js");

const reviewsRouter= require("./routes/review.js")
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");
app.set ("views" ,path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);

const dbUrl = process.env.ATLAS_DB_URL;

async  function main(){
    await mongoose.connect(dbUrl);
}

main().then((req,res)=>{
console.log("connected to db");
})
.catch(err => console.log(err));

const store = MongoStore.create({
   mongoUrl: dbUrl,
   touchAfter: 24 * 60 * 60, 
   crypto: {
       secret: process.env.SECRET
   }});

store.on("error",(err)=>{
   console.log("session store error",err);
})


const sessionOption = {
   store,
   secret : process.env.SECRET,
   resave : false,
   saveUninitialized : true,
   cookie :{
      expires : Date.now() + 7*24*60*60*1000,  // <-- corrected
      maxAge: 7*24*60*60*1000,
      httpOnly:true
   }
};



app.use (session(sessionOption));
app.use(flash());

app.use(passport.initialize());//initialize the passpost
app.use(passport.session());//ensure ki ek session ke andar diff diff page par password na lage
passport.use(new LocalStrategy(User.authenticate()));//method to authenticate the user .
passport.serializeUser(User.serializeUser());//for store ethe information
passport.deserializeUser(User.deserializeUser());//for  delette the information

app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser = req.user;
   next();
}
);

// app.get("/demouser", async(req,res)=>{
// let fakeUser = new User({
//    email:"pratham@123gmail.com",
//    username:"satyam" 
// })

//  let registeredUser = await User.register(fakeUser,"hello");//register is static method which save the
//  //user with the password : here "hello" as provided. 
//  res.send(registeredUser);
// });

 const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

//  app.get("/",(req,res)=>{
//     res.send("working");
//  });


app.use("/listings" ,listingsRouter);
app.use("/listings/:id/reviews" ,reviewsRouter);

// Redirect root to listings so the home page shows listings by default
app.get('/', (req, res) => {
   return res.redirect('/listings');
});

app.use("/" ,userRouter);
//Validation should only be used on create (POST) and update (PUT) routes.


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));  /// error throw karta hai for wrong path.
});

app.use ((err,req,res,next)=>{                         //error handler.
   let {statuscode = 500,message="something went wrong!"}= err;
res.status(statuscode).render("listings/error" ,{err})
})
























 








