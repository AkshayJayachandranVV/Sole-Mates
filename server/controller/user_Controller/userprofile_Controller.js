const user = require("../../model/user_register")
const productData = require("../../model/product_details")
const categoryData=require("../../model/category_Model")
const addressData=require("../../model/user_address")
const orderData=require("../../model/user_Orders")

const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
const bcrypt = require("bcrypt")
dotenv.config();







//DISPLAY THE ACCOUNT PAGE

const displayProfile=async(req,res)=>{

  try{

    console.log("The username "+req.session.username)
    console.log("The email "+req.session.email)

    if(req.session.username)
    {
      const userData= await user.findOne({username:req.session.username}) 
      const userAddress=await addressData.findOne({email:req.session.email })
      console.log(userData)
      console.log(userAddress)
      res.render("userProfile",{userData,userAddress})
    }

  }
  catch(e)
  {
    console.log("Problem witn the  display profile"+e)
  }
  



}






const addAddress=async(req,res)=>{

    try{
  
      console.log(req.query.success)
      let addData=req.query.success
      res.render("addAddress",{addData})
  
    }
    catch(e)
    {
      console.log("error with the displayAddress"+e)
    }
  
  }
  
  const storeAddress=async(req,res)=>{
  
   try{
  
    console.log(req.body)
    console.log(req.session.email)
  
    const newAdd=new addressData({
  
      fullname:req.body.fullname,
      phonenumber:req.body.phone,
      email:req.session.email,
      address:{
        pincode:req.body.pincode,
        housename:req.body.housename,
        state:req.body.state,
        city:req.body.city,
        district:req.body.district,
        country:req.body.country

      },
      primary:1,
    
  
  
    })
  
  
    await newAdd.save();

    res.redirect("/profile")
  
    // res.redirect("/addaddress?success=Address added Successfully")
  
   }
   catch(e)
   {
    console.log("error with the storeAddress"+ e)
   }
  
  
  }


  const displayEditprofile=async(req,res)=>{

   try{

    const userAdd=await addressData.findOne({email:req.session.email})
    let emailname=req.session.email

    console.log("hyyyy")

    // console.log(userAdd.address.pincode)

    res.render("addAddress",{userAdd,emailname})

   }
   catch(e)
   {
    console.log("Problem with the displayEditprofile")
   }


  }

  const updateProfile=async(req,res)=>{
 
    try{

        console.log(req.body.city)
        console.log(req.session.email)

        

        const update=await addressData.updateOne({email:req.session.email},{fullname:req.body.fullname,phonenumber:req.body.phone,  
            address:{
                pincode:req.body.pincode,
                housename:req.body.housename,
                state:req.body.state,
                city:req.body.city,
                district:req.body.district,
                country:req.body.country
        
          }})

        console.log(update)

        res.redirect("/profile")

    }
    catch(e)
    {
        console.log("Problem with the updateProfile "+e)
    }



  }



  //CHANGE PASSWORD DISPLAY PAGE

const changePassowrd=async(req,res)=>{

   try{

    res.render("otpLogin")

   }
   catch(e){

    console.log("problem with user profile changepassword"+e)

   }

  }

  //SENDEMAIL TO CHANGE PASSWORD


let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmailChange = expressAsyncHandler(async (req, res, next) => {
    try {

      console.log("sendEmai lChange enetered")

       console.log(req.session.email)
       let email=req.session.email
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




const newPasswordProfile = async (req, res) => {

  try{


    console.log("new password entered")
    console.log(req.body.password)
    console.log(req.body.confirmpassword)
    // console.log(checkEmail)
    // const email=req.body.email;
    console.log(req.session.user)
    const forgotEmail = req.session.email
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
    }
  
  }
  catch(e){
    console.log("problem with the newPasswordProfile"+e)
  }

  }
 

  const profileYourOrders=async(req,res)=>{
 

    try{
      console.log(req.session.username)

      const userOrder=await orderData.find({username:req.session.username})
      console.log(userOrder)

      res.render("yourOrders",{userOrder})

    }
    catch(e){
      console.log("problem with the profileYourOrders"+e)
    }


  }

  const userOrderDetailsPage=async(req,res)=>{
    try{

      console.log(req.query.orderId)
      console.log(req.query.proId)
  
     let productOrder = await orderData.findOne({orderId:req.query.orderId,productname:req.query.proId})

      res.render("userOrderDetails",{productOrder})



    }
    catch(e)
    {
      console.log("Problem with the userOrderDetailsPage"+e)
    }


  }

 



//EDIT THE USER DETAILS PAGE

// const updateProfile=async(req,res)=>{
 
//     try{

//     }
//     catch(e)
//     {
//         console.log("Problem withe ")
//     }


// }



  module.exports={
    displayProfile 
    ,addAddress,
    storeAddress,
    displayEditprofile,
    updateProfile,
    changePassowrd,
    sendEmailChange,
    otpValidationChangePass,
    newPasswordProfile,
    profileYourOrders,
    userOrderDetailsPage
  }