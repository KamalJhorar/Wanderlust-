
const User= require("../models/user")
 

module.exports.rendersignup=(req,res)=>{
    res.render("./users/signup")
};

module.exports.signupuser= async(req,res)=>{
    try{
        let {username,email,password}= req.body;
   const newuser= new User({email,username });
   const registeredUser= await  User.register(newuser,password);
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","welcome to Wanderlust");
    res.redirect("/listing");
   })
   console.log(registeredUser);
    }
    
    catch(e){
   req.flash("error",e.message);
   res.redirect("/signup");
    }
};

module.exports.renderlogin=(req,res)=>{
    res.render("./users/login")
};

module.exports.login=  async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirecturl=res.locals.redirecturl ||"/listing";
    res.redirect(redirecturl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((error)=>{
       if(error){ return next(error);}
    });
    req.flash("success","you are logged out now!");
    res.redirect("/listing");
};