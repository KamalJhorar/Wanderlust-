if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
// console.log(process.env.SECRET);


const express =require("express");
const app= express();
const mongoose= require("mongoose");
const port=8080;
const path= require("path");
const methodOverride=require("method-override")
const ejsmate=require("ejs-mate")
const ExpressError=require("./utils/expresserror")
const listingsrouter= require("./route/listing.js");
const reviewsrouter= require("./route/review.js");
const userrouter= require("./route/user.js");
const cookieparser= require("cookie-parser");
const session=require("express-session");


const MongoStore=require("connect-mongo");
const flash=require("connect-flash")
const passport= require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dburl=process.env.ATLASDB;

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); // method override
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public"))); 
app.engine('ejs',ejsmate);


// data base connected
main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err);
});
async function main() {
      await mongoose.connect(dburl);
    
}

// app.use(cookieparser());
// app.get("/getcookies",(req,res)=>{
//     res.cookie("kamal","jhorar");
//     res.cookie("ruchika","patel"); 
//     res.send("send some cookies")
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("i am cookies")
// })
const store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:"mysupersecret",
    },
    touchafter:24*3600,
});
store.on("error",()=>{
    console.log("error in  mongo session store")
})
const sessionoptions={
    store:store,
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,  
    }
};


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curuser=req.user;
    next();
})

// app.get("/demo",async(req,res)=>{
//     let fakeuser= new User({
//        email:"kamal@gmail",
//        username:"kamal", 
//     });
//    let regiseteduser=await User.register(fakeuser,"helloworld");
//    res.send(regiseteduser);
// })

app.use("/listing",listingsrouter);
app.use("/listing/:id/reviews",reviewsrouter);
app.use("/",userrouter);


// error handling wrap async
//if not route found then this is execute
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    // res.status(status).send(message);
    // res.send("something went wrong")
    // console.log(err);
    res.status(status).render("./listings/error",{err})
})

app.listen(port,()=>{
      console.log("server is listening "+port);
})









    // app.get("/testlisting", async (req,res)=>{
    //     let samplelisting= new listing({
    //         title:"my new villa",
    //         description:"new bewach",
    //         price:1000,
    //         location:"manit",
    //         country:"india",
    //     })
    //    await samplelisting.save();
    //     res.send("hi i am new root");
    // })







    //  data base username : kamaljhorar134
    // database password : gFGQoKCdFemFtPqV