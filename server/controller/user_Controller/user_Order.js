const user = require("../../model/user_register")
const productData = require("../../model/product_details")
const categoryData = require("../../model/category_Model")
const addressData = require("../../model/user_address")
const cartData = require("../../model/user_cart")
const orderData = require("../../model/user_Orders")

const displayCheckout = async (req, res) => {


  try {
    console.log("displayCkeout")

    // let userAddressData=req.session.userAddress
    const userAdd = await addressData.findOne({ email: req.session.email })
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
    req.session.userAddress = req.body

    console.log(req.session.userAddress)
    res.render("userPayment")

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



    for (i = 0; i < cartData.length - 1; i++) {
      console.log("enteredc into the forloop")
      console.log(cartProduct)
      console.log(cartProduct[i].productname)
      const newOrder = new orderData({
        username: req.session.username,
        quantity: 1,
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


module.exports = { displayCheckout, displayOrder, cashOnDelivery,cancelOrder }