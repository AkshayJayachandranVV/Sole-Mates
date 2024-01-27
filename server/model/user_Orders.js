const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)

const userOrder=mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    orderdate:{
        type:Date,
        require:true
    },
    productname:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    orderId:{
        type:String,
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    address:{
        pincode:{
            type:Number,
            require:true
        },
        state:{
            type:String,
            require:true
        },
        city:{
            type:String,
            require:true
        },
        housename:{
            type:String,
            require:true
        },
        district:{
            type:String,
            require:true
        },
        country:{
            type:String,
            require:true
        }

    },
    cancel:{
        type:Number,
        require:true
    }

})


module.exports=mongoose.model("userOrder",userOrder)