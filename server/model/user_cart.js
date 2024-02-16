const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)


const cartData=mongoose.Schema({

    productname:{
        type:String,
        require:true
    },
    imagepath:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    removevalue:{
        type:Number,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        require:true
    }
    

})

module.exports=mongoose.model("cartData",cartData)