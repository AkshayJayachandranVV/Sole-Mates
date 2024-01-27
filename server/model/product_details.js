const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)



const productData=mongoose.Schema({

    productname:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    color:{
        type:String,
        require:true
    },
    waranty:{
        type:String,
        require:true
    },
    imagepath:{
        type:Array,
        require:true
    },
    list:{
        type:Number,
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    display:{
        type:Number,
        require:true
    }



})

module.exports=mongoose.model("productDetails",productData)