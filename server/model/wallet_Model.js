const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)


const walletData=mongoose.Schema({

    username:{
        type:String,
        require:true
    },
    orderId:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        require:true
    },
    spendmoney:{
        type:Number,
        require:true
    },
    refundmoney:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        require:true
    }


})

module.exports=mongoose.model("walletData",walletData)