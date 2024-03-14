const user = require("../../model/user_register")
const productData = require("../../model/product_details")
const categoryData = require("../../model/category_Model")
const addressData = require("../../model/user_address")
const orderData = require("../../model/user_Orders")
const walletHistory=require("../../model/wallet_Model")
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
const bcrypt = require("bcrypt")
dotenv.config();
const mongoose=require("mongoose")







//DISPLAY THE ACCOUNT PAGE

const displayProfile = async (req, res) => {

  try {

    console.log("The username " + req.session.username)
    console.log("The email " + req.session.email)

    if (req.session.username) {
      const userData = await user.findOne({ username: req.session.username })
      const userAddress = await addressData.findOne({ email: req.session.email })
      console.log(userData)
      console.log(userAddress)
      res.render("userProfile", { userData, userAddress })
    }

  }
  catch (e) {
    console.log("Problem witn the  display profile" + e)
    res.redirect("/error")
  }




}






const addAddress = async (req, res) => {

  try {

    console.log(req.query.success)
    let addData = req.query.success
    res.render("addAddress", { addData })

  }
  catch (e) {
    console.log("error with the displayAddress" + e)
    res.redirect("/error")
  }

}

const storeAddress = async (req, res) => {

  try {

    console.log(req.body)
    console.log(req.session.email)

    const newAdd = new addressData({

      fullname: req.body.fullname,
      phonenumber: req.body.phone,
      email: req.session.email,
      address: {
        pincode: req.body.pincode,
        housename: req.body.housename,
        state: req.body.state,
        city: req.body.city,
        district: req.body.district,
        country: req.body.country

      },
      primary: 1,



    })


    await newAdd.save();

    res.redirect("/profile")

    // res.redirect("/addaddress?success=Address added Successfully")

  }
  catch (e) {
    console.log("error with the storeAddress" + e)
    res.redirect("/error")
  }


}


const displayEditprofile = async (req, res) => {

  try {

    const userAdd = await addressData.find({ email: req.session.email })
    let emailname = req.session.email

    console.log("hyyyy")

    // console.log(userAdd.address.pincode)

    res.render("addAddress", { userAdd, emailname })

  }
  catch (e) {
    console.log("Problem with the displayEditprofile")
    res.redirect("/error")
  }


}

const updateProfile = async (req, res) => {

  try {

    console.log(req.body.city)
    console.log(req.session.email)

    const update = await addressData.updateOne({ email: req.session.email }, {
      fullname: req.body.fullname, phonenumber: req.body.phone,
      address: {
        pincode: req.body.pincode,
        housename: req.body.housename,
        state: req.body.state,
        city: req.body.city,
        district: req.body.district,
        country: req.body.country

      }
    })

    console.log(update)

    res.redirect("/profile")

  }
  catch (e) {
    console.log("Problem with the updateProfile " + e)
    res.redirect("/error")
  }



}



//CHANGE PASSWORD DISPLAY PAGE

const changePassowrd = async (req, res) => {

  try {

    res.render("otpLogin")

  }
  catch (e) {

    console.log("problem with user profile changepassword" + e)
    res.redirect("/error")

  }

}

//SENDEMAIL TO CHANGE PASSWORD


let transporter = nodemailer.createTransport({
  service:"gmail",
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmailChange = expressAsyncHandler(async (req, res, next) => {
  try {

    console.log("sendEmai lChange enetered")

    console.log(req.session.email)
    let email = req.session.email
    // const phone = req.body.phonenumber
    // console.log("sendemail entered")
    // console.log(req.body.email)
    // const email = req.body.email;
    // console.log("email entered")
    // const emailString = email.toString();
    // console.log(emailString);


    otp = generateOTP();

    console.log(otp)
    // console.log(otp.OTP)
    //    console.log(otp.timestamp)

    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "OTP for Email Verfication",
      text: `Your OTP is: ${otp.OTP}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log("Email sent successfully!");
        res.render("otpLogin")
        // return otp;


      }
    });

  }


  catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');

  }
});



//OTP VALIDATION PART

const otpValidationChangePass = async (req, res) => {
  console.log("user entered otp")
  console.log(req.body.otp)


  // let otpvalue=sendEmailChange();
  // console.log(otpvalue)

  console.log("firdt otp")

  // const preGeneratedOTP = generateOTP();
  // console.log(otp.OTP)
  // console.log(otp.timestamp)


  console.log("hdhddd")

  if (otp.OTP == req.body.otp) {
    console.log("both otp are same")

    const currentTime = Date.now();
    const timeDifference = currentTime - otp.timestamp;

    console.log(timeDifference)

    expiryTimeInMilliseconds = 5 * 60 * 1000
    console.log(expiryTimeInMilliseconds)

    if (timeDifference <= expiryTimeInMilliseconds) {


      const userValue = req.session.details

      console.log(userValue)


      // const hashedpassword = await bcrypt.hash(userValue.password, 10)
      // console.log("after password")


      console.log("beforre saving the file int db")


      res.render("resetPassword")
    }
  }
  else {

    console.log("invalid otp in otpValidationChangePass")
    res.render("otpLogin")
  }


}



const displayChangePassword=async(req,res)=>{
  try{
    console.log(req.query.invalid)
    let incorrect=req.query.invalid
    res.render("resetPassword",{incorrect})

  }catch(e){
    console.log("problem withe displayChangePassword"+e)
  }
}


const newPasswordProfile = async (req, res) => {

  try {


    console.log("new password entered")
    console.log(req.body.password)
    console.log(req.body.confirmpassword)
    console.log(req.body.oldpassword)
    // console.log(checkEmail)
    // const email=req.body.email;
    console.log(req.session.user)
    const forgotEmail = req.session.email
    
    const oldPasswordCheck= await user.findOne({ email: forgotEmail })
    const checkPass = await bcrypt.compare(req.body.oldpassword, oldPasswordCheck.password)
    console.log(oldPasswordCheck)
    if(checkPass){
    if (req.body.password == req.body.confirmpassword) {
      console.log("check confirm password ")
      const emailExist = await user.findOne({ email: forgotEmail })
      const hashedpass = await bcrypt.hash(req.body.password, 10)
      if (emailExist) {

        console.log("confirming password and gonna update password")

        await user.updateOne({ email: forgotEmail }, { $set: { password: hashedpass } })

        req.session.destroy()

        res.redirect("/home")
      }
    }
    else {
      res.render("forgetPassword")
      // res.redirect("/profileresetpass?invalid=Password are not sam")
    }

  }else{
    // res.render("forgetPassword")
    res.redirect("/profileresetpass?invalid=Incorrect Old Password")

  }

  }
  catch (e) {
    console.log("problem with the newPasswordProfile" + e)
    res.redirect("/error")
  }

}


const profileYourOrders = async (req, res) => {


  try {
    console.log(req.session.username)

    let currentValue=req.query.page || 0

    if(req.query.next){
        currentValue++

    }

    if(req.query.previous){
        currentValue--

    }

    // const orderList=await orderData.find({}).skip(currentValue*6).limit(6).sort({_id:-1})


    // const userOrder=await orderData.find({username:req.session.username})

  
  // const userchechdata=await orderData.find({ username: req.session.username })

  // console.log(userchechdata)

  // 
  
  const orderAggregate = await orderData.aggregate([
    { $match: { username: req.session.username, totalAmount: { $exists: true } } }, // Filter documents where totalAmount exists
    {
      $group: {
        _id: {
          orderId: "$orderId",
          date: "$orderdate",
          totalAmount: "$totalAmount",
          status: "$status"
        },
        price: { $sum: "$price" },
        quantity: { $sum: "$quantity" }
      }
    },
    { $sort: { "_id.date": -1 } }, // Sort based on the date field within the _id object in descending order
    { $skip: (currentValue ) * 6 }, // Skip documents based on the page number
    { $limit: 6 } // Limit the number of documents per page
  ]);

  
console.log(orderAggregate + " tttttttttttttttttttttttttttttttttttt")
   

    // console.log(orderAggregate._id.orderId)
    // console.log(orderAggregate._id.date)

    const proCount = await orderData.find({ }).count()
    let countLimit = Math.ceil(proCount / 6);
    let countCurrent = currentValue + 1
    let hidLimit
    // const product = await productData.find({ list: 0 }).skip(currentPage * 6).limit(6)

    if((currentValue+1)==countLimit){
        hidLimit="success"
    }

    
     let aggregateDestructure=[]

     aggregateDestructure = orderAggregate


     const destructuredData = aggregateDestructure.map(({ _id, price, quantity}) => {
      const { orderId, date,status,productname,totalAmount } = _id;
      return { orderId, date,totalAmount,productname,status ,price, quantity };
    });

    console.log("heheheh")
    
    console.log(destructuredData);

    // console.log(orderAggregate)
    // const destructuredData = aggregateDestructure.map(({ orderId, date, price, quantity }) => ({ orderId, date, price, quantity }));


    // for(i=0;i<destructuredData.length;i++){
    //   console.log(destructuredData[i])
    // }


    console.log(orderAggregate)

    res.render("yourOrders", { destructuredData,currentValue,hidLimit })

  }
  catch (e) {
    console.log("problem with the profileYourOrders" + e)
    res.redirect("/error")
  }

}

const userOrderDetailsPage = async (req, res) => {
  try {


    console.log("enteredd oro the userdetaisl page")
    console.log(req.query.orderId)
    // console.log(req.query.proId)

    let productOrder = await orderData.find({username:req.session.username, orderId: req.query.orderId })
    console.log(productOrder)
    console.log(productOrder[0].coupon)
    let couponAmount=productOrder[0].coupon
    if(!couponAmount){
      couponAmount=0
    }
    let walletAmount=(productOrder[0].cartAmount-productOrder[0].coupon)-productOrder[0].totalAmount
    if(!walletAmount){
      walletAmount=0
    }
    console.log(walletAmount)

    res.render("userOrderDetails", { productOrder,couponAmount,walletAmount })

  }
  catch (e) {
    console.log("Problem with the userOrderDetailsPage" + e)
    res.redirect("/error")
  }


}





const profilefetchAddress=async(req,res)=>{


  console.log(req.body.addId)


  var id = new mongoose.Types.ObjectId(req.body.addId);


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


  try{
    
  }catch(e){
    console.log("problem with the profilefetchPassword"+e)
    res.redirect("/error")
  }
}





//Wallet History

const displayWallet=async(req,res)=>{
    try{
      console.log(" entered t  the displayWallet")
      console.log(req.session.username)
      const walletMoney=await user.findOne({username:req.session.username})
      let wallet=walletMoney.wallet
      const walletData=await walletHistory.find({username:req.session.username}).sort({_id:-1})
      console.log(walletData)
      res.render("walletHistory",{walletData,wallet});

    }
    catch(e)
    {
        console.log("Problem withe displayWallet")
        res.redirect("/error")
    }


}



// const searchOrders=async(req,res)=>{
//   try{
//     console.log("search oreders")
//     console.log(req.body.orders)
//     if (req.body.orders) {

//       const filterOrders = req.body.orders;
//       const regex = new RegExp(`${filterOrders}`, 'i');
  
//       const orderAggregate = await orderData.aggregate([
//           { 
//               $match: { 
//                   username: req.session.username,
//                   orderId: { $regex: regex }, // Using $regex to match orderId with the regex pattern
//                   totalAmount: { $exists: true } 
//               } 
//           },
//           {
//               $group: {
//                   _id: {
//                       orderId: "$orderId",
//                       date: "$orderdate",
//                       totalAmount: "$totalAmount",
//                       status: "$status" 
//                   },
//                   price: { $sum: "$price" },
//                   quantity: { $sum: "$quantity" }
//               }
//           },
//           { $sort: { "_id.date": -1 } } // Sort based on the date field within the _id object in descending order
//       ]);
//   }
  

//   }catch(e){
//     console.log("problem wiuth the searchOrders")
//   }
// }





module.exports = {
  displayProfile
  , addAddress,
  storeAddress,
  displayEditprofile,
  updateProfile,
  changePassowrd,
  sendEmailChange,
  otpValidationChangePass,
  newPasswordProfile,
  profileYourOrders,
  userOrderDetailsPage,
  profilefetchAddress,
  displayChangePassword,
  displayWallet,
 
}