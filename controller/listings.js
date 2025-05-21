const listing= require("../models/listing")
const mongoose= require("mongoose");


module.exports.index= async(req,res)=>{
    let alllist= await listing.find({});
      res.render("./listings/index.ejs",{alllist});
  };

  module.exports.rendernew=(req,res)=>{
    res.render("./listings/new")
};
module.exports.rendershow= async(req,res)=>{
    let {id}= req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid listing ID");
    }
    const list = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list ){
      req.flash("error","listing doesn't exist")
           res.redirect("/listing");
       }
       console.log(list);
    res.render("./listings/show",{list});
};

module.exports.create=async (req,res,next)=>{
    //   let {title,description,image,price,location,country}= req.body;
    let url=req.file.path;
    let filename=req.file.filename;
  let newlist= new listing(req.body.listing);
  newlist.image={url,filename }
  newlist.owner=req.user._id;
     await newlist.save();
     req.flash("success","New listing created!")
        console.log(newlist);
        res.redirect("/listing");
};


module.exports.edit=async(req,res)=>{
    let {id}= req.params;
    const list = await listing.findById(id);
    if(!list ){
      req.flash("error","listing doesn't exist")
           res.redirect("/listing");
       }
    console.log(list)
    res.render("./listings/edit",{list});  
};

module.exports.update=async(req,res)=>{
    let {id}= req.params;
 
    const list = await listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
     list.image={url,filename};
    await list.save();}
    req.flash("success","Listing Updated!")
    res.redirect(`/listing/${id}`);
    
};

module.exports.delete=async(req,res)=>{
    let {id}= req.params;
    const list = await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")

    res.redirect("/listing")
  };

