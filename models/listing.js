const mongoose= require("mongoose");
const review = require("./review");
const Schema= mongoose.Schema;

const listingschema= new Schema({
    title:
    {type:String,
     required:true,
    },
    description:String,
    image:
    {  url:String,
         filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum:["Trending","rooms","Mountain cities","Castles","swimming pools","Camping","Farms","Arctic"],
    },
});
listingschema.post(("findOneAndDelete"),async(listing)=>{
    if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}})
    }
})
 

const listing= mongoose.model("listing",listingschema);

module.exports=listing;