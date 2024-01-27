const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)


const userAddress=mongoose.Schema({

    fullname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phonenumber:{
        type:Number,
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
    primary:{
        type:Number,
        require:true
    }


})


module.exports=mongoose.model("addressData",userAddress)