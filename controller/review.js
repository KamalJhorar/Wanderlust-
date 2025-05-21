const listing= require("../models/listing")
const Review= require("../models/review") 

module.exports.createreview=async(req,res)=>{
    console.log(req.params.id);
    let list=await listing.findById(req.params.id);
    let newreview =new Review(req.body.review);
     newreview.author=req.user._id;
    list.reviews.push(newreview);
    await newreview.save();
    await list.save();
    console.log("new review saved");
    req.flash("success","New Review Created!")

    res.redirect(`/listing/${req.params.id}`)  
  };

  module.exports.deletereview=async(req,res)=>{
       let {id,reviewId}=req.params;
     await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}} );
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted!")
     res.redirect(`/listing/${id}`)
  };