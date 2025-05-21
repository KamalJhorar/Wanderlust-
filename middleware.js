const listing=require("./models/listing")
const Review=require("./models/review")


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl; 
        req.flash("error","must login to create listing")
       return res.redirect("/login");
    }
    next();
} 

module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}

module.exports.isowner= async(req,res,next)=>{
    let {id}= req.params;
    let lists= await listing.findById(id);
    if(!lists.owner.equals(res.locals.curuser._id)){
      req.flash("error","only owner can update listing");
      return res.redirect(`/listing/${id}`); 
    }
    next();
}

module.exports.isauthor=async(req,res,next)=>{
    let {id ,reviewId}= req.params;
    let lists= await Review.findById(reviewId);
    if(!lists.author.equals(res.locals.curuser._id)){
      req.flash("error","only owner can delete review");
      return res.redirect(`/listing/${id}`); 
    }
    next();
}