const user = require("../../model/user_register")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const categoryData=require("../../model/category_Model")
const addressData=require("../../model/user_address")
// generate otp part
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
dotenv.config();


let otp;


let checkEmail;





//RENDER THE HOME PAGE 

const renderHome=async(req,res)=>{
  
    try{

      let enter=req.session.authenticated
      const images = await productData.find({})
    

        res.render("userHome",{enter,images})

    }
    catch(e)
    {
        console.log(e)
    }

}

// const AuthorizeCheck=async(req,res,next)=>{

//   try{
//        if(req.session.authenticated)
//        {
//              next()
//        }
//        else
//        {
//         res.redirect("/userLogin")
//        }
//   }
//   catch(e)
//   {
//     console.log("the error with  authorize cehck"+e)
//   }

// }


























// //EMAIL SENDING OTP 

// let transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//         user: process.env.SMTP_MAIL,
//         pass: process.env.SMTP_PASSWORD,
//     },
// });

// const sendEmail = expressAsyncHandler(async (req, res, next) => {
//     try {

//         if (req.body.email !== undefined) {

//             const phone = req.body.phonenumber
//             console.log("sendemail entered")
//             console.log(req.body.email)
//             const email = req.body.email;
//             console.log("email entered")
//             const emailString = email.toString();
//             console.log(emailString);

//             otp = generateOTP();

//             console.log(otp)

//             var mailOptions = {
//                 from: process.env.SMTP_MAIL,
//                 to: email,
//                 subject: "OTP form Callback Coding",
//                 text: `Your OTP is: ${otp.OTP}`,
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     res.status(500).send('Error sending email');
//                 } else {
//                     console.log("Email sent successfully!");
//                     // res.redirect("/otplogin") 
//                     return next();


//                 }
//             });
//         }
//     }


//     catch (error) {
//         console.error(error);
//         res.status(500).send('Error sending email');

//     }
// });

// //OTP verification password reset

// const resetValidationOtp = async (req, res) => {
//     console.log("user entered otp")
//     console.log(req.body.otp)

//     console.log("firdt otp")

//     // const preGeneratedOTP = generateOTP();
//     console.log(otp.OTP)
//     console.log(otp.timestamp)


//     console.log("hdhddd")

//     if (otp.OTP == req.body.otp) {
//         console.log("both otp are same")

//         const currentTime = Date.now();
//         const timeDifference = currentTime - otp.timestamp;

//         console.log(timeDifference)


//         expiryTimeInMilliseconds = 5 * 60 * 1000
//         console.log(expiryTimeInMilliseconds)

//         if (timeDifference <= expiryTimeInMilliseconds) {

//             res.redirect("/resetPassword")

//         } else {

//             console.log("invalid otp")
//             res.render("otpLogin")
//         }


//     }
//     else {

//         console.log("invalid otp")
//         res.render("otpLogin")
//     }


// }





// //OTP VALIDATION PART

// const otpValidation = async (req, res) => {
//     console.log("user entered otp")
//     console.log(req.body.otp)

//     console.log("firdt otp")

//     // const preGeneratedOTP = generateOTP();
//     console.log(otp.OTP)
//     console.log(otp.timestamp)


//     console.log("hdhddd")

//     if (otp.OTP == req.body.otp) {
//         console.log("both otp are same")

//         const currentTime = Date.now();
//         const timeDifference = currentTime - otp.timestamp;

//         console.log(timeDifference)


//         expiryTimeInMilliseconds = 5 * 60 * 1000
//         console.log(expiryTimeInMilliseconds)

//         if (timeDifference <= expiryTimeInMilliseconds) {


//             const userValue = req.session.details

//             console.log(userValue)


//             const hashedpassword = await bcrypt.hash(userValue.password, 10)
//             console.log("after password")


//             const newUser = new user({

//                 username: userValue.username,
//                 email: userValue.email,
//                 phonenumber: userValue.phonenumber,
//                 password: hashedpassword,
//                 isAdmin: 0,
//                 status: 1
//                 // confirmpassword:req.body.confirmpassword

//             })

//             console.log("beforre saving the file int db")

//             req.session.user = newUser
//             await newUser.save();
//             // const emailCheck=req.body.email;
//             // console.log(emailCheck)

//             console.log(req.session.signup)

//             if (req.session.signup) {
//                 console.log("Signup session entered")
//                 res.redirect("/userLogin")
//             }
//             else if (req.session.forgot) {
//                 console.log("forgot  session entered")

//                 res.redirect("/resetPassword")

//             }
//         }
//     }
//     else {

//         console.log("invalid otp")
//         res.render("otpLogin")
//     }


// }

// DISPLAY IMAGES IN THE HOME FROM THE PRODUCT DATA




// const productDetailPage = async (req, res) => {


//     try {

//         console.log(req.params.id)
//         let value = req.params.id


//         console.log("entered the product data page")
//         // const images = await productData.find({})
//         const productD = await productData.findOne({ productname: value }).lean()

//         // console.log(productD.waranty, 'pddrrorr')



//         //   const {productname,category,price,description,imagepath}=productD

//         console.log('---***--')
//         //   console.log(productname)
//         //   console.log(category)
//         //   console.log(price)
//         //   console.log(description)
//         //   console.log(imagepath)

//         console.log(productD.imagepath)

//         res.render("detailsProduct",{productD})
//         //   res.render("detailsProduct", {productname,category,price,description,imagepath})

//     }

//     catch (e) {
//         console.log(e, '---------------')
//     }


// }











//   module.exports = { sendEmail,otpValidation };  
module.exports = {renderHome}