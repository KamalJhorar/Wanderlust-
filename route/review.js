const express= require("express");
const router= express.Router({mergeParams:true});
const mongoose= require("mongoose");
const{reviewschema}=require("../schema.js") 
const listing= require("../models/listing")
const Review= require("../models/review") 
const wrapAsync= require("../utils/wrapasync")
const ExpressError=require("../utils/expresserror")
const{listingschema}=require("../schema.js")
const {isloggedin}=require("../middleware.js")
const {isauthor}=require("../middleware.js")
const reviewcontroller=require("../controller/review.js")

const validatereview=((req,res,next)=>{
    const {error} = reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
       throw new ExpressError(400,errmsg)
    }
    else{
        next(); 
    }
});



  // reviews  post route
  router.post("/",isloggedin,validatereview,wrapAsync(reviewcontroller.createreview));

  // delete a review
  router.delete(("/:reviewId"),isloggedin,isauthor,wrapAsync(reviewcontroller.deletereview))

module.exports=router;
  