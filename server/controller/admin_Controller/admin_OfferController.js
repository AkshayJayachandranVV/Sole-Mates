const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData=require("../../model/user_Orders")
const offerData=require("../../model/offer_Model")


const displayOfferPage=async(req,res)=>{
    try{

        const displayProduct=await productData.find({})
        res.render("adminOffer",{displayProduct})
        

    }catch(e){
        console.log("Problem with the displayOfferPage"+e)
        res.redirect("/admin/error")
    }
}


const addOffer=async(req,res)=>{
    try{

        console.log(req.body)

        const updateProduct=await productData.updateOne({ productname:req.body.productname},{$set:{status:"Applied",offer:req.body.offer}})
       
        console.log(updateProduct)

        res.redirect("/admin/offer")

    }catch(e){
        console.log("problem withe the addOffer"+e)
        res.redirect("/admin/error")
    }
}

module.exports={
    displayOfferPage,
    addOffer

}