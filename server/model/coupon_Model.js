const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)

const couponData=mongoose.Schema({

    coupon:{
        type:String,
        require:true
    },
    couponId:{
        type:String,
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
    amount:{
        type:Number,
        require:true
    },
    minAmount:{
        type:Number,
        require:true
    }
})  

module.exports=mongoose.model("couponDetails",couponData)