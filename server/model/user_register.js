const mongoose=require("mongoose")
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODBATLAS)
.then(()=>{console.log("Connection established with db")})
.catch((e)=>{console.log(e)})

const userRegister=mongoose.Schema({

    username:{
        type:String,
        require:true
    },
    email: {
        type: String,
        require: true
    },
    phonenumber: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Number,         
        require: true
    },
    status: {
        type: Number,    
        require: true
    },
    couponArray: {
        type: Array,    
        require: true
    },
    wallet: {
        type: Number,    
        require: true
    }
})


module.exports=mongoose.model("userRegister",userRegister)