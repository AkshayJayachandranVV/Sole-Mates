const express=require("express")
const route=express.Router()
const session=require("express-session")
const multer=require("multer")
// const upload=multer({dest:"public/images"})
const path=require('path')
const userData=require("../controller/admin_Controller/admin_Controller")
const adminUsers=require("../controller/admin_Controller/admin_UserController")
const adminProduct=require("../controller/admin_Controller/admin_ProductController")
const adminCategory=require("../controller/admin_Controller/admin_CategoryContoller")
const adminOrder=require("../controller/admin_Controller/admin_OrderController")
const middleware=require("../middleware/middleware")
const dashboard=require("../controller/admin_Controller/admin_DashboardController")
const adminCoupon=require("../controller/admin_Controller/admin_CouponController")
const adminOffer=require("../controller/admin_Controller/admin_OfferController")
const authAdmin=require("../../server/middleware/middleware")

route.use(session({
    secret: 'idkhudebsdhbedbbdejsdnjncantfindme',
    resave: false,
    saveUninitialized: true,
   
    // cookie: { maxAge: 24*60*60*7*4 }

    cookie: {
        httpOnly: true,
        maxAge: 1*60*60*1000
      }
}))




route.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});





route.get("/",userData.displayPanel)


route.post("/",userData.Login)

route.get("/signout",userData.signout)

route.use(authAdmin.adminAuthorizeCheck)

//SIGNOUT ADMIN




route.get("/dashboard",dashboard.dashboardData)

route.get('/sales',dashboard.dashboardDisplay)




route.post('/salesReport',dashboard.salesReport)


//MULTER IMAGE UPLOAD
const storage=multer.diskStorage({
    
    destination:(req,file,cb)=>{
        cb(null,"./public/images/");
        // cb(null, path.join(__dirname, 'public/images'));
    },
    filename:(req,file,cb)=>{
        console.log(file)
        cb(null,Date.now() + path.extname(file.originalname))
    },
});

const upload=multer({storage:storage})



route.post("/upload",[ upload.array("avatar",4),adminProduct.productDetails])

route.post("/editproducts/:id", [upload.array("avatar",4),adminProduct.updateProduct])



//    console.log(" entered multer space")    
//     if (req.files) {
//         // File uploaded successfully
//         console.log(req.file);
//         res.redirect("/admin/addproducts?success=Product Uploaded Succesfully")
//     } else {
//         // An error occurred
//         console.error("Error uploading file:", req.file);   
//         res.status(500).send("Error uploading file");
//     }
// })





// DASHBOARD
route.get("/dashboard",[dashboard.dashboardDisplay,dashboard.dashboardData])




//USERS
route.get("/users",adminUsers.showUser)

route.get("/userpagenation",adminUsers.showUser)

route.post("/users",adminUsers.searchUser) 

route.get("/block/:username",adminUsers.blockUser)   


//PRODUCTS
route.get("/products",adminProduct.productDisplay)

route.post("/products",adminProduct.searchProduct)

//ADD PRODUCTS
route.get("/addproducts",adminProduct.addProductDisplay)

route.get("/productdelete/:product",adminProduct.deleteProduct)


route.get("/productpagenation",adminProduct.productDisplay)

// route.get("/editproducts/:edit",adminProduct.editProduct)




//CATEGORY
route.get("/category",adminCategory.categoryDetails)

//LIST AND UNLIST
route.get("/list/:category",adminCategory.list)

//EDIT CATEGORY IN ADMIN CATEGORY
route.post("/category",adminCategory.storeCategory)

//DELETE CATEGORY
route.get("/categorydel/:catId",adminCategory.categoryDelete)

//EDIT CATEGORY
route.post("/editcategory/:catid",adminCategory.editCategory)


//ORDERSUPDATE
route.get("/orders",adminOrder.displayOrder)

//ORDER STATUS UPDATE
route.post("/updatestatus",adminOrder.updateOrderStatus)


route.get("/removeorder/:orderId",adminOrder.deleteOrder)


route.get("/orderdetails",adminOrder.displayOderDetails)


route.get("/returnaccept",adminOrder.returnAccept)

route.get("/returnreject",adminOrder.returnReject)



//COUPON
route.get("/coupon",adminCoupon.displayCouponPage)

route.post("/addcoupon",adminCoupon.addCoupon)

// route.post("/addoffer",adminOffer.addOffer)

route.post("/applyoffer",adminOffer.addOffer)

route.get("/offer",adminOffer.displayOfferPage)

route.get("/deletecoupon",adminCoupon.deleteCoupon)

route.post("/editcoupon/:id",adminCoupon.editcoupon)


route.get("/orderpagenation",adminOrder.displayOrder)


route.get("/couponpagenation",adminCoupon.displayCouponPage)


module.exports=route     


































