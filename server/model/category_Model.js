const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)

const categoryData=mongoose.Schema({

    category:{
        type:String,
        require:true
    },
    list:{
        type:Number,
        require:true
    },
    offer:{
        type:Number,
        require:true
    },
    applied:{
        type:Number,
        require:true
    }
})  

module.exports=mongoose.model("categoryDetails",categoryData)