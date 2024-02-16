const user = require("../../model/user_register")
const productData = require("../../model/product_details")
const categoryData = require("../../model/category_Model")
const addressData = require("../../model/user_address")
const cartData = require("../../model/user_cart")
const orderData = require("../../model/user_Orders")

const mongoose=require("mongoose")

const displayCheckout = async (req, res) => {


  try {
    console.log("displayCkeout")

    // let userAddressData=req.session.userAddress
    const userAdd = await addressData.find({ email: req.session.email })
    console.log(userAdd)
    res.render("checkout", { userAdd })

  }
  catch (e) {
    console.log("Error with the displayCheckout" + e)
  }


}


const displayOrder = async (req, res) => {

  try {

    // Object.size = function (obj) {
    //   var size = 0,
    //     key;
    //   for (key in obj) {
    //     if (obj.hasOwnProperty(key)) size++;
    //   }
    //   return size;
    // };
    console.log("log into the display order" )
    // if (Object.size(req.body) == 0) {
    //   console.log("not req.body")
    //   // console.log(req.body)
    //   const userAdd = await addressData.findOne({ email: req.session.email })
    //   req.session.userAddress = userAdd


    // }
    // else {
    //   console.log("req.body")
    //   console.log(req.body)
    //   req.session.userAddress = req.body

    // }

console.log(req.body)




    
    req.session.userAddress = req.body

    console.log(req.session.userAddress)

    const cartCount=await cartData.find({}).count()

    const totalprice=await cartData.aggregate([
      {
          $match:{username:req.session.username}
      },
      {
          $group:{_id:"$productname",price:{$sum:"$price"},quantity:{$sum:"$quantity"}}
      },
      {
          $project:{_id:0,amount:{$multiply:["$price","$quantity"]}}
      },
      {
          $group:{_id:"null",total:{$sum:"$amount"}}
      }
  ])


  console.log(totalprice)
  let totalValue=totalprice[0].total
  console.log(totalValue)

  console.log(totalprice)

  const User=req.session.username

    res.render("userPayment",{cartCount,totalValue,User})

  }
  catch (e) {
    console.log("problem with displayOrder" + e)
  }


}

const otpGenerator = require("otp-generator");

const orderId = () => {
  const OTP = otpGenerator.generate(16, {
    upperCaseAlphabets: true,
    digits: false,
    lowerCaseAlphabets: true,
    specialChars: false,
  });
  const timestamp = Date.now();
  return { OTP, timestamp };
  // return OTP;
};








const cashOnDelivery = async (req, res) => {

  try {

    let otpValue = orderId()
    console.log(otpValue)
    let otp = otpValue.OTP
    let date = otpValue.timestamp

    console.log("cashOnDelivery")

    const cartProduct = await cartData.find({ username: req.session.username });
    //const userData=await user.find({email:req.session.email});
    //  const addressD=await addressData.find({email:req.session.email})
    // console.log(cartData)
    // console.log(userData)
    // console.log(address)

    console.log("checking the useraddress in the session")
    console.log(req.session.userAddress)


    console.log(cartProduct.length)
    // console.log(addressD)
    // console.log(addressD[0].address.pincode)

    if(req.session.userAddress.newaddress)
    {
      console.log(req.session.userAddress.fullname)
      console.log(req.session.userAddress)
      const newAdd=new addressData({
  
        fullname:req.session.userAddress.fullname,
        phonenumber:req.session.userAddress.phone,
        address:{
          pincode:req.session.userAddress.pincode,
          housename:req.session.userAddress.housename,
          state:req.session.userAddress.state,
          city:req.session.userAddress.city,
          // district:req.session.userAddress.district,
          country:req.session.userAddress.country
  
        },
        primary:0,
      
    
    
      })
    
    
      await newAdd.save();

    }
    if(cartProduct.length==1){

    console.log("entered into the cart product if condition")
      const newOrder = new orderData({
        username: req.session.username,
        quantity: cartProduct[0].quantity,
        productname: cartProduct[0].productname,
        price: cartProduct[0].price,
        orderdate: date,
        image:cartProduct[0].imagepath,
        orderId: otpValue.OTP,
        address: {
          pincode: req.session.userAddress.pincode,
          state: req.session.userAddress.state,
          city: req.session.userAddress.city,
          housename: req.session.userAddress.housename,
          district: req.session.userAddress.district,
          country: req.session.userAddress.country,

        },
        status: "ORDER PLACED",
        cancel:0,

      })
      await newOrder.save();

    }
    else{


    for (let i = 0; i <cartProduct.length; i++) {
      console.log("enteredc into the forloop")
      console.log(cartProduct)
       console.log(cartProduct[i].quantity)
      console.log(cartProduct[i].productname)
      const newOrder = new orderData({
        username: req.session.username,
        quantity: cartProduct[i].quantity,
        productname: cartProduct[i].productname,
        price: cartProduct[i].price,
        orderdate: date,
        image:cartProduct[i].imagepath,
        orderId: otpValue.OTP,
        address: {
          pincode: req.session.userAddress.pincode,
          state: req.session.userAddress.state,
          city: req.session.userAddress.city,
          housename: req.session.userAddress.housename,
          district: req.session.userAddress.district,
          country: req.session.userAddress.country,

        },
        status: "ORDER PLACED",
        cancel:0,

      })
      await newOrder.save();

    }
  }

    const order = await orderData.find({ username: req.session.username })
    console.log(order)

    console.log(req.session.username)

    console.log("before delete the cart")


    const deleteCartData = await cartData.deleteMany({ username: req.session.username })

    console.log(deleteCartData)


    // console.log(cartProduct[0].productname)
    // console.log(cartProduct[0].price)
    res.render("userOrders", { order, success: "Order Placed Successfull"})

  }
  catch (e) {
    console.log("problem withe the cashOnDekivery" + e)
  }



}




const cancelOrder=async(req,res)=>{

  try{

    console.log(req.query.orderId)
    console.log(req.query.proId)

     await orderData.updateOne({orderId:req.query.orderId,productname:req.query.proId},{$set:{status:"CANCELLED"}})
     res.redirect("/userorders")

  }
  catch(e){

    console.log("problem withe the cancelOrder"+e)

  }


}


const Razorpay = require('razorpay'); 

const razorpayInstance = new Razorpay({
    key_id : process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const createOrder = async(req,res)=>{
  try {

    console.log(req.body)
      const amount = req.body.price*100
      console.log('0')
      const options = {
          amount: amount,
          currency: 'INR',
          receipt: 'razorUser@gmail.com'
      }
      console.log('1')
      razorpayInstance.orders.create(options, 
          (err, order)=>{
            console.log('2')
              if(!err){
                console.log('3')
                  res.status(200).send({
                      success:true,
                      msg:'Order Created',
                      order_id:order.id,
                      amount:amount,
                      key_id:process.env.RAZORPAY_ID_KEY,
                      //product_name:req.body.name,
                      // description:req.body.description,
                      //contact:"8567345632",
                      //name: "Sandeep Sharma",
                      //email: "sandeep@gmail.com"
                  });
                
              }
              else{
                  res.status(400).send({success:false,msg:'Something went wrong!'});
              }
          }
      );

  } catch (error) {
      console.log(error.message);
  }
}



const fetchAdress=async(req,res)=>{

  try{


    console.log(req.body.addressId)

    var id = new mongoose.Types.ObjectId(req.body.addressId);


    const addressD=await addressData.findOne({_id:id})

    console.log(addressD.fullname)
    let fullname=addressD.fullname
    let phonenumber=addressD.phonenumber
    let country=addressD.address.country
    let state=addressD.address.state
    let pincode=addressD.address.pincode
    let district=addressD.address.district
    let city=addressD.address.city
    let housename=addressD.address.housename

    res.json({fullname,phonenumber,country,state,pincode,district,city,housename}  )  

  }catch(e){
    console.log("problem withe the fetchAdress"+e)
  }

}





// const onlinePayment=async(req,res)=>{
//   try{


//     let razorpay=razorpayPayment.razorpayOnlinePayment

//     console.log(razorpay)


//   }
//   catch(e){
//     console.log("Problem with the onmlinePayment "+e)

//   }
// }


module.exports = { displayCheckout, displayOrder, cashOnDelivery,cancelOrder,createOrder,fetchAdress }