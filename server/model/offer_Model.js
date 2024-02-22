const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)

const offerData=mongoose.Schema({

    productname:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    offer:{
        type:Number,
        require:true
    },
    endDate:{
        type:String,
        require:true
    },
    startDate:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    }
})  

module.exports=mongoose.model("offerData",offerData)