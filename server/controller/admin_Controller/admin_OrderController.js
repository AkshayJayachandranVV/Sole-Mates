const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData=require("../../model/user_Orders")




//ORDERS DISPLAY PAGE

const displayOrder=async(req,res)=>{
   
    try{
      
      let currentValue=req.query.page || 0

      if(req.query.next){
          currentValue++

      }

      if(req.query.previous){
          currentValue--

      }

      const orderList=await orderData.find({}).skip(currentValue*6).limit(6).sort({_id:-1})

      // const value = await userData.find({}).sort({_id:-1})

      // console.log(value)

      // res.render("adminUsers",{userList,currentValue})


        // const orderValue=await orderData.find({}).sort({_id:-1})

        res.render("adminOrders",{orderList,currentValue});

    }
    catch(e)
    {
        console.log("problem withe the displayOrder")
    }

}

//UPDATE THE ORDER STATUS

const updateOrderStatus=async(req,res)=>{
    try{

        // console.log(req.)
        // console.log("proId"+req.params.proId)
        // console.log("proId"+req.params.userId)
    //  console.log(req.query)

       console.log(req.body.category)




       const updateData=await orderData.updateOne({orderId:req.query.orderId,productname:req.query.proId},{$set:{status:req.body.category}})


       

       console.log(updateData)

       res.redirect("/admin/orders")

    }
    catch(e){
        console.log("Problem withe the updateOrderStatus"+e)
    }

}


const deleteOrder=async(req,res)=>{
  try{

console.log(req.params.orderId)


    const deleteData= await orderData.deleteOne({orderId:req.params.orderId})
    console.log(deleteData)
    res.redirect("/admin/orders")


  }
  catch(e){

    console.log("problem withe the deleteOrder"+e)
  }

}



const displayOderDetails=async(req,res)=>{
 
    try{

        console.log(req.query.orderId)
        console.log(req.query.proId)


        const orderDetails=await orderData.findOne({orderId:req.query.orderId,productname:req.query.proId})
        
        const image=await productData.findOne({productname:orderDetails.productname})
        console.log(orderDetails.productname)

        console.log(image)

        console.log(image.imagepath[0])

        let img=image.imagepath[0]


        res.render("adminOrderdetails",{orderDetails,img})

    }
    catch(e){
        console.log("problem withe thedisplayOrderDEtail "+e)
    }


}





const returnAccept=async(req,res)=>{
    try{
      console.log("entererd to return Accept")
      console.log(req.query.proId)
      console.log(req.query.orderId)
      await orderData.updateOne({ orderId:req.query.orderId, productname: req.query.proId },{ $set:{ status:"RETURN ACCEPTED" } })
      const orderD=await orderData.findOne({ orderId:req.query.orderId, productname: req.query.proId })
      await userData.updateOne({ username: req.session.username }, { $inc: { wallet: orderD.price }});
      // await userData.updateOne({username:req.session.username },{ $set:{ wallet:orderD.price}})
      console.log(orderD.price)
      console.log(userData)
      res.redirect("/admin/orders")
  
    }catch(e){
      console.log("Problem with the returnAccept"+e)
    }
  }
  
  
  const returnReject=async(req,res)=>{
    try{
        console.log("entererd to return Rejected")
      console.log(req.query.proId)
      console.log(req.query.orderId)
      await orderData.updateOne({ orderId:req.query.orderId, productname: req.query.proId },{ $set:{ status:"RETURN REJECTED" } })
      res.redirect("/admin/orders")
  
    }catch(e){
      console.log("Problem with the returnAccept"+e)
    }
  }
  
  


module.exports={
    displayOrder,
    updateOrderStatus,
    deleteOrder,
    displayOderDetails,
    returnAccept,
    returnReject

}