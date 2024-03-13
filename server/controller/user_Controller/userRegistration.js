const user = require("../../model/user_register")

const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
const bcrypt = require("bcrypt")
const dotenv = require("dotenv");
dotenv.config();


let otp;


let checkEmail;





//RENDER THE  USERLOGIN PAGE

const userLogin=async(req,res)=>{
 
    try{

        console.log("entered user login")

        const statusval=req.query.status
        const validate = req.query.uname
        const Passwordvalidate = req.query.pass
        res.render("userLogin", { validate, Passwordvalidate,statusval })

    }
    catch(e)
    {
        console.log(e)
        res.redirect("/error")
    }


}




//RENDER THE HOME PAGE

const renderSignup=async(req,res)=>{
 
    try{
  console.log(req.query.email )
  console.log(req.query.uname )
  console.log(req.query.Invalid )
  console.log(req.query.nameCheck)     
        const unameValidate = req.query.uname    
        const emailValidate = req.query.email 
        const emailCheck= req.query.Invalid
        const unameExist=req.query.nameCheck
        
    if (req.query.uname ) {
        console.log("it has enterd into the signup if phase")
        const { username, email, phonenumber, password } = req.session.details
        console.log(req.session.details)
        res.render("userSignup", { unameValidate,username, email, phonenumber, password });
    } else {
        console.log("it has enterd into the signup else code")
        if (req.query.email ) {
            console.log("it has enterd into the email if phase")
            const { username, email, phonenumber, password } = req.session.details
            console.log(req.session.details)
            res.render("userSignup", { emailValidate,username, email, phonenumber, password });
        } else {
            console.log("it has enterd into the email else code")

            if (req.query.Invalid) {
                console.log("it has enterd into the Invalid Invalid phase")
                // const { username, email, phonenumber, password } = req.session.details
                // console.log(req.session.details)
                res.render("userSignup", { emailCheck});
            } else {
                console.log("it has enterd into the email invalid code")

                if (req.query.nameCheck) {
                    console.log("it has enterd into the Invalid namecheck phase")
                    // const { username, email, phonenumber, password } = req.session.details
                    // console.log(req.session.details)
                    res.render("userSignup", { unameExist});
                } else {
                    console.log("it has enterd into the email namecheck code")
                   
                    res.render('userSignup')
                }
               
                // res.render('userSignup')
            }
            // res.render('userSignup')
        }
        // res.render('userSignup')
    }

       

    }
    catch(e)
    {
        console.log("This is the render the signup renderSignup")
        res.redirect("/error")
    }


}


//CHECK THE CRIDENTIALS ARE VALIDATED

const userRegister = async (req, res) => {

    try {

        console.log("useR REgisted has entered")

        req.session.details = req.body
        console.log(req.session.details)
        const email = req.body.email
        req.session.emailotp=req.body.email
        const phone = req.body.phonenumber
        const password=req.body.password

        const nameExist = await user.findOne({ username: req.body.username })
        const emailExist = await user.findOne({ email: req.body.email })

        if (nameExist) {
            res.redirect("/signup?uname=Username Already Existed")

        }
        else if (emailExist) {
            res.redirect("/signup?email=Already have an Account")
        }
        else if (!email.match(/^[A-Za-z\._\-[0-9]+@[A-Za-z]+\.[a-z]{2,}$/)) {
            res.redirect("/signup?uname=Invald Email")
        }
        else if (!(phone.length == 10 || phone.length == 12)) {
            res.redirect("/signup?uname=Invalid Phonenumber");
        }
    //     else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/) )
    //      {
    //         res.redirect("/signup?uname=Your password needs to be strong");
    //     }
        else {
            req.session.entered = "entered";
            req.session.forgot = false;
            console.log(req.session.signup)
            console.log(req.session.forgot)

            res.redirect("/otplogin")

        }

    }
    catch (e) {
        console.log(e)
        res.redirect("/error")

    }
}



//REBDER THE OTPGENERATION PAGE
const renderOtpGeneration=async(req,res)=>{
    try{
        console.log("entered re")
        console.log(req.query.Invalid)
        let emailErr=req.query.Invalid

        res.render("otpGeneration",{emailErr})

    }
    catch(e)
    {
        console.log("This for function renderOtpGeneration")
          res.redirect("/error")
    }


}




const forgotpasspost = async (req, res) => {
    try {

        console.log("forgot passpost entered")
        const email = req.body.email;
        req.session.emailpass=email
        req.session.emailotp=req.body.email
        const emailExist = await user.findOne({ email: email })

        if (emailExist) {
            console.log("check the user its exist or not in the forgotpasspost")
            res.redirect("/forgototplog")
            //  return next();
        }
        else{
            res.redirect("/forgetpassword?Invalid=Please Enter Valid Email")

        }
        
    }
    catch (error) {
        console.log(error)
        console.log("passpost error")
        res.redirect("/error")

    }



}


//RENDER THE OTPLOGIN PAGE

const otpLogin=async (req,res)=>{
 
    try{

        console.log(req.query.Incorrect)
        let Incorrect=req.query.Incorrect
        res.render("otpLogin",{Incorrect})

        // res.render("otpLogin")

    }
    catch(e)
    {
        console.log(e)
        res.redirect("/error")
    }

}


//RENDER THE FORGET PASSWORD PAGE
const renderforgetPassword=async(req,res)=>{
    try{
        console.log(req.query.Incorrect)
        let Incorrect=req.query.Incorrect
        res.render("forgetPassword",{Incorrect})

    }
    catch(e)
    {
        console.log("This for function renderOtpLogin")
        res.redirect("/error")
    }


}


const newPassword = async (req, res) => {
    try{

    console.log("new password entered")
    console.log(req.body.password)
    console.log(req.body.confirmpassword)
    // console.log(checkEmail)
    // const email=req.body.email;
    console.log(req.session.user)
    console.log(req.session.emailpass)
    const forgotEmail = req.session.emailpass
    if (req.body.password == req.body.confirmpassword) {
        console.log("check confirm password ")
        const emailExist = await user.findOne({ email: forgotEmail })
        const hashedpass = await bcrypt.hash(req.body.password, 10)
        if (emailExist) {

            console.log("confirming password and gonna update password")

            await user.updateOne({ email: forgotEmail }, { $set: { password: hashedpass } })

            res.redirect("/home")
        }
    }
    else {
        res.redirect("/resetPassword?Incorrect=Enter Correct Password")
        // res.render("forgetPassword")
    }
   }catch(e){
    console.log("problem with the newPassword"+e)
    res.redirect("/error")
 }

}



const renderotpLogin=async(req,res)=>{
 
    try{
        console.log(req.query.Incorrect)
        let Incorrect=req.query.Incorrect
        res.render("otpLogin",{Incorrect})

    }
    catch(e)
    {
        console.log("This for function renderOtpLogin")
        res.redirect("/error")
    }


}







// Authentication checks the user is present or not


const CheckUserIn = async (req, res) => {

    try {

        console.log(req.body)

        console.log("check user try entererd")

        console.log("nop value not reached")
        const { email } = req.body
        if (!email.match(/^[A-Za-z\._\-[0-9]+@[A-Za-z]+\.[a-z]{2,}$/))
            res.redirect("/userLogin?uname=Enter the correct email")
        else {
            const checkUser = await user.findOne({ email: req.body.email })
            console.log(checkUser)
            if (checkUser) {

                if(checkUser.status)
                {

                const checkPass = await bcrypt.compare(req.body.password, checkUser.password)
                if (checkPass) {


                    req.session.authenticated = true;
                    req.session.entered = null;
                    req.session.username = checkUser.username;
                    req.session.email=checkUser.email
                    res.redirect("/")
                }
                else {
                    res.redirect("/userLogin?pass=Invalid Password")
                    console.log("invalid password")
                }

            }
            else{

                res.redirect("/userLogin?status=User Entry is Denied")

            }
            }
            else {
                res.redirect("/userLogin?uname=Invalid Email Address")
                console.log("invalid email")
            }
        }

    }
    catch (e) {
        console.log("check user catch enterert")
        console.log(e)
        res.redirect("/error")
    }
}








let transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmail = expressAsyncHandler(async (req, res, next) => {
    try {

        const nameExist = await user.findOne({ username: req.body.username })
        if(!nameExist){

        if (req.body.email !== undefined) {

            console.log("enetered first")

            const emailExist = await user.findOne({ email: req.body.email })
            

            if(!emailExist){
                console.log("enetered second")
            const phone = req.body.phonenumber
            console.log("sendemail entered")
            console.log(req.body.email)
            const email = req.body.email;
            console.log("email entered")
            const emailString = email.toString();
            console.log(emailString);

            otp = generateOTP();

            console.log(otp)
            console.log(otp.OTP)
               console.log(otp.timestamp)

            var mailOptions = {
                from:"SoleMates.shop <process.env.SMTP_MAIL>",
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
                    // res.redirect("/otplogin") 
                    return next();


                }
            });
        }else{
            res.redirect("/signup?Invalid=Already have an Account")

        }
        }else{
            res.redirect("/signup?Invalid=Please Enter Valid Email")
        }
    }else{
        res.redirect("/signup?nameCheck=Username Already Existed")
    }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');

    }
});





let forgetPasstransporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const forgetPasssendEmail = expressAsyncHandler(async (req, res, next) => {
    try {

        if (req.body.email !== undefined) {
                 const emailExist = await user.findOne({ email: req.body.email })

                if(emailExist){

                    const phone = req.body.phonenumber
                    console.log("sendemail entered")
                    console.log(req.body.email)
                    const email = req.body.email;
                    console.log("email entered")
                    const emailString = email.toString();
                    console.log(emailString);

                    otp = generateOTP();

                    console.log(otp)
                    console.log(otp.OTP)
                    console.log(otp.timestamp)

                    var mailOptions = {
                        from:"SoleMates.shop <process.env.SMTP_MAIL>",
                        to: email,
                        subject: "OTP for Email Verfication",
                        text: `Your OTP is: ${otp.OTP}`,
                    };

                    forgetPasstransporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.status(500).send('Error sending email');
                        } else {
                            console.log("Email sent successfully!");
                            // res.redirect("/otplogin") 
                            return next();

                        }
                    });
                }else{
                    res.redirect("/forgetpassword?Invalid=Please Enter Valid Email")

                }
          }else{
            res.redirect("/forgetpassword?Invalid=Please Enter Valid Email")
          }
    }


    catch (error) {
        console.error(error);
        res.status(500).send('Error sending email');

    }
});







//OTP verification password reset

const resetValidationOtp = async (req, res) => {
    try{

    console.log("Entered in tooooooo the resetvalidationotp to forget password check fetch 7878787878787878787")
    console.log(req.body)
    console.log(req.body.otp)

    console.log("firdt otp")

    // const preGeneratedOTP = generateOTP();
    console.log(otp.OTP)
    console.log(otp.timestamp)


    console.log("hdhddd")

    if (otp.OTP == req.body.otp) {
        console.log("both otp are same")

        const currentTime = Date.now();
        const timeDifference = currentTime - otp.timestamp;


        console.log("time diffrence checking")

        console.log(timeDifference)


        expiryTimeInMilliseconds = 60 * 1000
        console.log(expiryTimeInMilliseconds)

        if (timeDifference <= expiryTimeInMilliseconds) {

            console.log("redirect code")
            if(req.session.entered){
                
            const userValue = req.session.details

            console.log(userValue)


            const hashedpassword = await bcrypt.hash(userValue.password, 10)
            console.log("after password")


            const newUser = new user({

                username: userValue.username,
                email: userValue.email,
                phonenumber: userValue.phonenumber,
                password: hashedpassword,
                isAdmin: 0,
                status: 1,
                wallet:0
                // confirmpassword:req.body.confirmpassword

            })

            console.log("beforre saving the file int db")

            req.session.user = newUser
            await newUser.save();

                let signup="entered"
                return res.json({ success: false,signup})

            }else{

                let forgot="entered"
                return res.json({ success: false,forgot})
                
            }
            


            // res.redirect("/resetPassword")

            // res.redirect("/signup")

        } else {
             console.log("invalid otp Timing")
            let msg="Otp has Expired"
            return res.json({ success: true,msg})
           
            // res.redirect("/forgototplog?Incorrect=Otp has Expired")
        }


    }
    else {

        console.log("invalid otp")
        let msg="Incorrect Otp Entered"
        return res.json({ success: true,msg})
        // res.redirect("/forgototplog?Incorrect=Incorrect Otp Entered")
        // res.render("otpLogin")
    }
}
catch(e){
    console.log("problem withe the resetValidationOtp"+e)
    res.redirect("/error")
}


}





//OTP VALIDATION PART

const otpValidation = async (req, res) => {
    console.log("user entered otp of otpValidation")
    console.log(req.body.otp)

    console.log("firdt otp")

    // const preGeneratedOTP = generateOTP();
    // console.log(otp)
    // console.log(otp.OTP)
    // console.log(otp.timestamp)


    console.log("hdhddd")
    console.log(otp.OTP )
    

    if (otp.OTP == req.body.otp) {
        console.log("both otp are same")

        const currentTime = Date.now();
        const timeDifference = currentTime - otp.timestamp;

        console.log(timeDifference)


        expiryTimeInMilliseconds = 60 * 1000
        console.log(expiryTimeInMilliseconds)

        if (timeDifference <= expiryTimeInMilliseconds) {


            const userValue = req.session.details

            console.log(userValue)


            const hashedpassword = await bcrypt.hash(userValue.password, 10)
            console.log("after password")


            const newUser = new user({

                username: userValue.username,
                email: userValue.email,
                phonenumber: userValue.phonenumber,
                password: hashedpassword,
                isAdmin: 0,
                status: 1
                // confirmpassword:req.body.confirmpassword

            })

            console.log("beforre saving the file int db")

            req.session.user = newUser
            await newUser.save();
            // const emailCheck=req.body.email;
            // console.log(emailCheck)

            console.log(req.session.signup)

            // if (req.session.signup) {
            //     console.log("Signup session entered")
            //     res.redirect("/userLogin")
            // }
            // else if (req.session.forgot) {
            //     console.log("forgot  session entered")

            //     res.redirect("/resetPassword")

            // }

            console.log("Signup session entered")
               res.redirect("/userLogin")
        }else{

            console.log("invalid otp of otpValidation")
            res.redirect("/signup")

        }
    }
    else {

        console.log("invalid otp")
        res.render("otpLogin")
    }


}



let transporterresend = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },
  });
  
  const sendEmailChangeresend = expressAsyncHandler(async (req, res, next) => {
    try {
  
      console.log("sendEmail for otp resend enetered")
  
      console.log(req.session.emailotp)
      let email =req.session.emailotp
      if(req.session.emailotp!==undefined){
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
  
      transporterresend.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).send('Error sending email');
        } else {
          console.log("Email sent successfully!");
          res.redirect("/otplogin")
        //   res.render("otpLogin")
          // return otp;
  
  
        }
      });
    }else{
        res.redirect("/forgetpassword?Invalid=Please Enter Valid Email")
    }
  
    }
  
  
    catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
      res.redirect("/error")
  
    }
  });





  //OTP VALIDATION PART

const otpValidationResendOtp = async (req, res) => {
    console.log("user entered otp")
    console.log(req.body.otp)
    console.log(otp.OTP)
  
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
        console.log(" entered to time stamp after password")


        // const newUser = new user({

        //     username: userValue.username,
        //     email: userValue.email,
        //     phonenumber: userValue.phonenumber,
        //     password: hashedpassword,
        //     isAdmin: 0,
        //     status: 1,
        //     wallet:0
        //     // confirmpassword:req.body.confirmpassword

        // })

        console.log("beforre saving the file int db")

        // req.session.user = newUser
        // await newUser.save();
        // const emailCheck=req.body.email;
        // console.log(emailCheck)

        // console.log(req.session.signup)

        

        // console.log("Signup session entered")
           res.redirect("/resetPassword")
      }
    }
    else {
  
      console.log("invalid otp in otpValidationChangePass")
      res.render("otpLogin")
    }
  
  
  }
  

module.exports = {sendEmail,resetValidationOtp,otpValidation,CheckUserIn,renderotpLogin,newPassword,renderforgetPassword,otpLogin,forgotpasspost,renderOtpGeneration,userRegister,renderSignup,userLogin,sendEmailChangeresend,otpValidationResendOtp,forgetPasssendEmail}





























// const expressAsyncHandler = require("express-async-handler");
// const dotenv = require("dotenv");
// const nodemailer = require("nodemailer");
// const generateOTP = require("./generateOTP"); 
// dotenv.config();



// let forgotvalue=false,signupvalue=false;





// let transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_MAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// const sendEmail = expressAsyncHandler(async (req, res,next) => {
//   try{
//   console.log("sendemail entered")
//   console.log(req.body.email)
//   // const { email } = req.body.email;
//   const email=req.body.email;
//   console.log("email entered")
//   console.log(email);

//     otp = generateOTP();

//   console.log(otp)

//   var mailOptions = {
//     from: process.env.SMTP_MAIL,
//     to: email,
//     subject: "OTP form Callback Coding",
//     text: `Your OTP is: ${otp}`,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent successfully!");  
//       res.redirect("/otplogin") 
//       // req.session.forgot = false
//       // req.session.signup = true

//       // forgotvalue= req.session.forgot
//       // signupvalue=req.session.signup
//      return next();
     
//     }
//   });
// }
// catch(error)
// {
//   console.error(error);
//   res.status(500).send('Error sending email');

// }
// });



// const otpValidation=async (req,res)=>{
// console.log("user entered otp")
// console.log(req.body.otp)
// console.log(req.body.email)
// console.log("firdt otp")

// // const preGeneratedOTP = generateOTP();
// console.log(otp)


//   console.log("hdhddd")

// if(otp==req.body.otp){
//   console.log("both otp are same")

//   // const emailCheck=req.body.email;
//   // console.log(emailCheck)

//   console.log(req.session.signup)

//   if(req.session.signup)
//   {
//     console.log("Signup session entered")
    
    
  
   
    
//     res.redirect("/userLogin")
//   }
//   else if(req.session.forgot)
//   {
//     console.log("forgot  session entered")
    
//     res.redirect("/resetPassword")
     
//   }
// }
// else{

//   console.log("invalid otp")
//   res.render("otpLogin")
// }


// }

// // i ended here created two session signup and forgot for using verification otp first need to goto login after signup then it need to go for the forgot password


// module.exports = { sendEmail,otpValidation };    










// const sendMail=async (req,res)=>{

//     res.send("emqil is sended")

// }

// module.exports=sendMail



// const nodemailer = require("nodemailer");

// const sendMail = async (req, res) => {
//   let testAccount = await nodemailer.createTestAccount();

//   // connect with the smtp
//   let transporter = await nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//         user: 'molly92@ethereal.email',
//         pass: 'rkgpDZnpcZqU49KXdr'
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"Vinod Thapa 👻" <thapa@gmail.com>', // sender address
//     to: "akshayjayachandranaj@gmail.com", // list of receivers
//     subject: "Hello Thapa", // Subject line
//     text: "Hello YT Thapa", // plain text body
//     html: "<b>Hello YT Thapa</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   res.json(info);
// };

// module.exports = sendMail;

