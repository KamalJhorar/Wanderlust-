const mongoose= require("mongoose");
const initdata= require("./data");
const listing= require("../models/listing");



main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err);
});
async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initdb= async ()=>{
    await listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,owner:"67fa770bbca497ace2b9702d"}));
   await listing.insertMany(initdata.data);
   console.log("data was initalized");
}
initdb();