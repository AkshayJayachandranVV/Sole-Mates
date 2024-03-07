const express = require("express")
const route = express.Router();
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
    cookie: {
        httpOnly: true,
        maxAge: 1*60*60*1000
      }
}))












//USER REGISTRATION
route.get("/otplogin", userRegister.renderotpLogin)
route.post("/otplogin",userRegister.otpValidation)



route.get("/userLogin", userRegister.userLogin)
route.post("/userLogin", userRegister.CheckUserIn)
route.get("/signup", userRegister.renderSignup);    
route.post('/signup', userRegister.sendEmail,userRegister.userRegister);




route.get("/forgetpassword", userRegister.renderOtpGeneration)
route.post("/forgetpassword", [userRegister.forgetPasssendEmail, userRegister.forgotpasspost])

////////////////////////////////////
route.get("/forgototplog", userRegister.otpLogin)
route.post("/forgototpcheck",userRegister.resetValidationOtp )
////////////////////////////////////////////////////////////////////////////////////////////////////

route.get("/resetPassword", userRegister.renderforgetPassword)



route.post("/resetPassword", userRegister.newPassword)
route.get("/resendotpexpire",userRegister.sendEmailChangeresend)
route.post("/resendotpexpire",userRegister.otpValidationResendOtp)









route.get("/home",userProduct.renderHome)


route.get("/",userProduct.HomeImages)
route.get("/productdetails/:id",userProduct.productDetailPage)
route.get("/allcollection",userProduct.allCollectionDisplay)



route.get("/categoryproduct/:id",userProduct.displayProduct)



route.get("/pagenation",userProduct.allCollectionDisplay)




route.get("/categorypagenation",userProduct.displayProduct)




route.post("/searchproduct",userProduct.userSearchProduct)




route.get("/hightolow",userProduct.HightoLow)
route.get("/lowtohigh",userProduct.lowToHigh)

route.get("/hightolowpagenation",userProduct.HightoLow)
route.get("/lowtohighpagenation",userProduct.lowToHigh)

route.get("/lowtohighcatpagenation",userProduct.lowToHigh)
route.get("/hightolowcatpagenation",userProduct.HightoLow)
//avoid display details page in thode product controlelr

// route.get("/lowtohighpagenation",userProduct.HightoLow)
// route.get("/hightolowpagenation",userProduct.HightoLow)
// route.get("/lowtohighpagenation",userProduct.lowToHigh)









//CART 
route.get("/cart",addCart.userAuthorize,addCart.cartDisplay)
route.get("/addtocart/:prodname",middleware.userAuthorizeCheck,addCart.addToCart)
route.get("/decrementquantity/:proId",addCart.decrementData)
route.get("/incrementquantity/:proId",addCart.incrementData)
route.get("/removecart/:proId",middleware.userAuthorizeCheck,addCart.cartRemoving)
route.post("/change-quentity",addCart.updateQuantity)












//USER PROFILE
route.get("/profile",middleware.userAuthorizeCheck,profile.displayProfile)
route.get("/editprofile",middleware.userAuthorizeCheck,profile.displayEditprofile)
route.post("/editprofile",profile.updateProfile)
route.get("/userorders",middleware.userAuthorizeCheck,profile.profileYourOrders)
route.get("/userorderdetails",middleware.userAuthorizeCheck,profile.userOrderDetailsPage)
route.get("/addaddress",middleware.userAuthorizeCheck,profile.addAddress)
route.post("/addaddress",profile.storeAddress)
route.post("/changepassword",profile.otpValidationChangePass)


route.get("/profileresetpass",middleware.userAuthorizeCheck,profile.displayChangePassword)
route.post("/profileresetpass",middleware.userAuthorizeCheck,profile.newPasswordProfile)


route.post("/profile-fetchpassword",profile.profilefetchAddress)











// USER WISHLIST
route.get("/wishlist",middleware.userAuthorizeCheck,wishList.displayWishlist)
route.get("/addwishlist/:proId",middleware.userAuthorizeCheck,wishList.addWishlist)
route.get("/delwishlist/:wishId",middleware.userAuthorizeCheck,wishList.deleteWishlist)









route.post('/createOrder',middleware.userAuthorizeCheck, Order.createOrder)



route.get("/paymentfailure",middleware.userAuthorizeCheck,Order.paymentFailure)
route.post("/retryOrder",middleware.userAuthorizeCheck, Order.createOrder)
route.post("/discardOrder",middleware.userAuthorizeCheck, Order.discardAll)




route.post("/checkcoupon",Order.couponVerify)
route.post("/returnorder",Order.returnOrder)
 route.get("/checkout",middleware.userAuthorizeCheck,Order.displayCheckout)
 route.get("/moreaddress",middleware.userAuthorizeCheck,Order.moreAddress)
route.post("/orderplaced",middleware.userAuthorizeCheck,Order.displayOrder)
route.get("/orderplaced",middleware.userAuthorizeCheck,Order.displayOrder)
route.get("/cod",middleware.userAuthorizeCheck,Order.cashOnDelivery)
route.get("/cancelorder",Order.cancelOrder)
route.post("/applywallet",Order.walletApply)
route.post("/removewallet",Order.walletRemove)
route.post("/fetch-address",Order.fetchAdress)
route.post("/remove-coupon",Order.removeCoupon)
route.get("/invoice",Order.invoice)







route.get("/error",(req,res)=>{
    res.render("errorPage")
})

route.get("/signout",(req,res)=>
{
    req.session.destroy()
    res.redirect("/home")
})


module.exports = route

