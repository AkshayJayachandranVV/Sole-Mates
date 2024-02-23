const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData=require("../../model/user_Orders")
const couponData=require("../../model/coupon_Model")


const displayCouponPage=async(req,res)=>{
    try{
       console.log(req.query.alreadycoupon)
       console.log(req.query.lessamount)
       let already=req.query.alreadycoupon
       let lessPrice=req.query.lessamount


      let currentValue=req.query.page || 0

      if(req.query.next){
          currentValue++

      }

      if(req.query.previous){
          currentValue--

      }

      const coupon=await couponData.find({}).skip(currentValue*6).limit(6).sort({_id:-1})

        res.render("adminCoupon",{coupon,already,lessPrice,currentValue})

    }catch(e){
        console.log("problem withe displayCouponPage"+e)
        res.redirect("/admin/error")
    }
}



const addCoupon=async(req,res)=>{
    try{

        console.log("entered into the add coupomn")

        console.log(req.body)
        let coupon=req.body
        console.log(coupon.category[0])
        console.log(coupon.category[1])
        console.log(coupon.startDate)
        console.log(coupon.endDate)
        if(Number(coupon.category[1])<=coupon.minamount){

        const newCoupon=new couponData({
            coupon:coupon.category[0],
            amount:coupon.category[1],
            startDate:coupon.startDate,
            minAmount:coupon.minamount,
            couponId:coupon.couponId,
            endDate:coupon.endDate,
        })

        await newCoupon.save();

        res.redirect("/admin/coupon")
    }else{
        console.log("problem when amount and minimum amount less")
        res.redirect("/admin/coupon?lessamount=Cant Add Coupon !!! Check Minimum Amount ")

    }

    }catch(e){
        console.log("Problem with the addCoupon"+e)
        res.redirect("/admin/error")
    }
}


const deleteCoupon=async(req,res)=>{
    try{
    console.log(req.query.coupon)
        const coupon=await couponData.deleteOne({coupon:req.query.coupon})

        res.redirect("/admin/coupon")

    }catch(e){
        console.log("problem with the deleteCoupon "+e)
        res.redirect("/admin/error")
    }
}


const editcoupon=async(req,res)=>{
    try{


        console.log("entered into the edit coupon")
        console.log(req.body)
        let coupon=req.body
        console.log(req.body.couponId)

        const filter=req.body.couponId
        const regex = new RegExp(`^${filter}`, 'i')

        const Alreadycoupon=await couponData.find({couponId:{$regex:regex}})
        console.log(Alreadycoupon)
        console.log(coupon.category[1])
        console.log(coupon.minamount)
        if(Number(coupon.category[1])<=coupon.minamount){
                if(Alreadycoupon.length<1 || (req.body.couponId==req.body.oldcouponId)){
                    console.log("enterereddghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                
                    const couponedit=await couponData.updateOne({coupon:req.body.category[0],couponId:req.body.couponId,amount:req.body.category[1],minAmount:req.body.minamount,startDate:req.body.startDate,endDate:req.body.endDate})
                    //  res.render("adminCoupon",{couponedit})
                    res.redirect("/admin/coupon")

                }else{
                    res.redirect("/admin/coupon?alreadycoupon=Coupon Already Present")
            
                }
            }else{
                console.log("problem when amount and minimum amount less in the edit coupon")
                res.redirect("/admin/coupon?lessamount=Cant Add Coupon !!! Check Minimum Amount ")
            }
    }catch(e){
        console.log("problem with the editCoupon"+e)
        res.redirect("/admin/error")
    }
}






module.exports={displayCouponPage,addCoupon,deleteCoupon,editcoupon}