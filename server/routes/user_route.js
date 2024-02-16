const express = require("express")
const route = express.Router();
const User = require("../controller/user_Controller/user_Controller")
const  userRegister = require("../controller/user_Controller/userRegistration")
const userProduct=require("../controller/user_Controller/user_Products")
const addCart=require("../controller/user_Controller/cart_Controller")
const wishList=require("../controller/user_Controller/wishlist_Controller")
const profile=require("../controller/user_Controller/userprofile_Controller")
const Order=require("../controller/user_Controller/user_Order")
const Email=require("../controller/user_Controller/generateOTP")
const middleware=require("../middleware/middleware")
//  const otpValidation=require("../controller/emal-Sending")
const session = require("express-session")




route.use(session({
    secret: 'idkhudebsdhbedbbdejsdnjncantfindme',
    resave: false,
    saveUninitialized: false,
   
    // cookie: { maxAge: 24*60*60*7*4 }

    cookie: {
        httpOnly: true,
        maxAge: 1*60*60*1000
      }
}))



//Login side is here and check Authentication









//OTP VALIDATION
route.get("/otplogin", userRegister.renderotpLogin)

route.post("/otplogin",userRegister.otpValidation)

// USER LOGIN AND AUTHENTICATION CODE
route.get("/userLogin", userRegister.userLogin)

route.post("/userLogin", userRegister.CheckUserIn)



// GET request to render the userSignup view
route.get("/signup", userRegister.renderSignup);    

 route.post('/signup', userRegister.sendEmail,userRegister.userRegister);

 route.get("/forgetpassword", userRegister.renderOtpGeneration)

 route.post("/forgetpassword", [userRegister.sendEmail, userRegister.forgotpasspost])


 route.get("/forgototplog", userRegister.otpLogin)

route.post("/forgototplog",userRegister.resetValidationOtp )


route.get("/resetPassword", userRegister.renderforgetPassword)

route.post("/resetPassword", userRegister.newPassword)



route.get("/resendotpexpire",userRegister.sendEmailChangeresend)

route.post("/resendotpexpire",userRegister.otpValidationResendOtp)






//Entry to Home







route.get("/signout",(req,res)=>
{
    req.session.destroy()
    res.redirect("/home")
})

route.get("/",userProduct.HomeImages)

route.get("/home",User.renderHome)


// route.use(middleware.userAuthorizeCheck)





route.get("/productdetails/:id",middleware.userAuthorizeCheck,userProduct.productDetailPage)


// ALL COLLECTION
route.get("/allcollection",middleware.userAuthorizeCheck,userProduct.allCollectionDisplay)


//DISPLAY PRODUCT ON THE BASIS OF CATEGORY

route.get("/categoryproduct/:id",middleware.userAuthorizeCheck,userProduct.displayProduct)


//PAGENATION ALL COLLECTION
route.get("/pagenation",middleware.userAuthorizeCheck,userProduct.allCollectionDisplay)

//PAGENATION CATEGORY COLLECTION
route.get("/categorypagenation",middleware.userAuthorizeCheck,userProduct.displayProduct)

route.post("/searchproduct",userProduct.userSearchProduct)


route.get("/hightolow",middleware.userAuthorizeCheck,userProduct.HightoLow)

route.get("/lowtohigh",middleware.userAuthorizeCheck,userProduct.lowToHigh)








//CART DISPLAY
route.get("/cart",addCart.userAuthorize,addCart.cartDisplay)

//ADD TO CART

route.get("/addtocart/:prodname",middleware.userAuthorizeCheck,addCart.addToCart)


//UPDATE THE QUANTITY OF THE CART PRODUCT
route.get("/decrementquantity/:proId",addCart.decrementData)

route.get("/incrementquantity/:proId",addCart.incrementData)


//ADD TO CART REMOVE PRODUCT
route.get("/removecart/:proId",middleware.userAuthorizeCheck,addCart.cartRemoving)













//DISPLAY THE USER PROFILE
route.get("/profile",middleware.userAuthorizeCheck,profile.displayProfile)

//EDIT PROFILE 
route.get("/editprofile",middleware.userAuthorizeCheck,profile.displayEditprofile)

route.post("/editprofile",profile.updateProfile)



route.get("/userorders",middleware.userAuthorizeCheck,profile.profileYourOrders)

route.get("/userorderdetails",middleware.userAuthorizeCheck,profile.userOrderDetailsPage)


//DISPLAY THE ADDRESS OF USER

route.get("/addaddress",middleware.userAuthorizeCheck,profile.addAddress)

route.post("/addaddress",profile.storeAddress)


// DISPLAY THE USER PROFILE OTP PAGE

// route.get("/changepassword",profile.sendEmailChange)

 route.post("/changepassword",profile.otpValidationChangePass)


route.get("/profileresetpass",middleware.userAuthorizeCheck,profile.displayChangePassword)

route.post("/profileresetpass",middleware.userAuthorizeCheck,profile.newPasswordProfile)













//DISPLAY THE USER WISHLIST

route.get("/wishlist",middleware.userAuthorizeCheck,wishList.displayWishlist)


route.get("/addwishlist/:proId",middleware.userAuthorizeCheck,wishList.addWishlist)

route.get("/delwishlist/:wishId",middleware.userAuthorizeCheck,wishList.deleteWishlist)









route.post('/createOrder',middleware.userAuthorizeCheck, Order.createOrder);




route.post("/checkcoupon",Order.couponVerify)

route.post("/returnorder",Order.returnOrder)

//DISPLAY
 route.get("/checkout",middleware.userAuthorizeCheck,Order.displayCheckout)

route.post("/orderplaced",middleware.userAuthorizeCheck,Order.displayOrder)
route.get("/orderplaced",middleware.userAuthorizeCheck,Order.displayOrder)

route.get("/cod",middleware.userAuthorizeCheck,Order.cashOnDelivery)



route.get("/cancelorder",Order.cancelOrder)

// route.post("/onlinecreateOrder",Order.razorpayOnlinePayment)



route.post("/applywallet",Order.walletApply)

route.post("/removewallet",Order.walletRemove)




route.post("/fetch-address",Order.fetchAdress)


route.post("/remove-coupon",Order.removeCoupon)



route.post("/change-quentity",addCart.updateQuantity)

route.post("/profile-fetchpassword",profile.profilefetchAddress)

route.get("/error",(req,res)=>{
    res.render("errorPage")
})



// SignUp OTP send SIGNUP User data entered to DB

// route.get("/signup", (req, res) => {
//     res.render("userSignup");
// });


// route.post('/signup', [otpValidation.sendEmail, User.addUser])




// POST request to handle form submission
// route.post('/signup', [User.sendEmail, User.addUser]);


// route.post("/signup", async (req, res) => {

//     try {

//         await otpEmail.sendEmail(req, res);
//         await User.userRegister(req, res);

       

//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');

//     }
// })


// route.get("/formalstore", User.collectionImage);










module.exports = route

// route.post("/login",User.CheckUserIn)

// route.get("/sendmail",sendMail)


// signup code and stores the data to db

// route.post("/signup",sendEmail,User.addUser)
// route.post('/signup', [User.addUser, sendEmail]);
// route.post('/signup', User.addUser);