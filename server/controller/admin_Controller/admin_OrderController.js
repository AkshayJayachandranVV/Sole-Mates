const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData=require("../../model/user_Orders")




//ORDERS DISPLAY PAGE

const displayOrder=async(req,res)=>{
   
    try{

        const orderValue=await orderData.find({})

        res.render("adminOrders",{orderValue});

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


module.exports={
    displayOrder,
    updateOrderStatus,
    deleteOrder,
    displayOderDetails

}