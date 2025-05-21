const express= require("express");
const router= express.Router();
const mongoose= require("mongoose");
const wrapAsync= require("../utils/wrapasync")
const{listingschema}=require("../schema.js")
const ExpressError=require("../utils/expresserror")
const listing= require("../models/listing")
const {isloggedin}=require("../middleware.js")
const {isowner}=require("../middleware.js")
const listingcontroller=require("../controller/listings.js")
const multer= require("multer");
const {storage}=require("../cloudconfig.js")
const upload=multer({storage})

const validatelisting=((req,res,next)=>{
    const {error} = listingschema.validate(req.body);
    // console.log(error);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
       throw new ExpressError(400,errmsg)
    }
    else{
        next(); 
    }
})

router.route("/")
   .get(wrapAsync(listingcontroller.index))
   .post(isloggedin,upload.single("listing[image]"), validatelisting,wrapAsync(listingcontroller.create));
   


     //new lisitng
  router.get("/create",isloggedin,listingcontroller.rendernew )

   router.route("/:id")
   .get(wrapAsync(listingcontroller.rendershow))
   .put(isloggedin,isowner,upload.single("listing[image]"),validatelisting, wrapAsync(listingcontroller.update))
   .delete( isloggedin,isowner, wrapAsync( listingcontroller.delete))



// index route
    // router.get("/",wrapAsync(listingcontroller.index));
  

 
  //create route
  // router.post("/",isloggedin,validatelisting, wrapAsync(listingcontroller.create));

  // show route
  // router.get("/:id",wrapAsync(listingcontroller.rendershow));
  
  // edit route
    router.get("/:id/edit",isloggedin,isowner, wrapAsync(listingcontroller.edit));

   //update route
    // router.put("/:id",isloggedin,isowner,validatelisting, wrapAsync(listingcontroller.update));
  
    //delete route
  // router.delete("/:id", isloggedin,isowner, wrapAsync( listingcontroller.delete));
  
  
  
    
  
  module.exports=router;
  