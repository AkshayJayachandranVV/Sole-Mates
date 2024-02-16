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


route.use(session({
    secret: 'idkhudebsdhbedbbdejsdnjncantfindme',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24*60*60*7*4 }
}))


route.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});






// const {initializeApp}=require("firebase/app")
// const {getStorage,ref,getDownloadURL,uploadBytesResumable}=require("firebase/storage")
// // const config=require("../config/firebase.config")

// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // const initializeApp=require("firebase/app")
// const getAnalytics=require("firebase/analytics")
// const dotenv=require("dotenv")

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD6b0WTzlPSZvcFLc4NHSeloN4FtxJ7HkY",
//   authDomain: "project-1-f9a22.firebaseapp.com",
//   projectId: "project-1-f9a22",
//   storageBucket: "project-1-f9a22.appspot.com",
//   messagingSenderId: "613691081303",
//   appId: "1:613691081303:web:567ff8c71341e0dad49912",
//   measurementId: "G-CH2YW791DY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);



// // initializeApp(config.firebaseConfig)

// const storage=getStorage();


// const upload=multer({storage:multer.memoryStorage()  });

// route.post("/upload",upload.single("avatar"),async(req,res)=>{

//     try{

//         const dateTime=Date.now();

//         const storageRef=ref(storage, `files/${req.file.originalname  + " " + dateTime} `)

//         const metaData={
//             contentType:req.file.mimetype,

//         };
//             //upload the file in the bucket storage
//             const snapshot=await uploadBytesResumable(storageRef,req.file.buffer,metaData)

              
//             //grab the public url
//             const downloadURL=await getDownloadURL(snapshot.ref)

//             userData.productDetails(downloadURL,req.body)

//             console.log("File Uploaded Successfully")

//              res.redirect("/admin/addproducts?success=uploaded successfully !!!!!!!")

//             // return res.send({

//             //     message:'file uploaded to firbase storage  ',
//             //     name:req.file.originalname,
//             //     type:req.file.mimetype,
//             //     downloadURL:downloadURL
//             // })
        

//     }
//     catch(e)
//     {
//         console.log(e)
//     }



// })

route.get("/",middleware.adminAuthorizeCheck)


route.get("/dashboard",dashboard.dashboardData)

route.get('/sales',dashboard.dashboardDisplay)

route.post("/",userData.Login)



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

route.post("/users",adminUsers.searchUser) 

route.get("/block/:username",adminUsers.blockUser)   


//PRODUCTS
route.get("/products",adminProduct.productDisplay)

route.post("/products",adminProduct.searchProduct)

//ADD PRODUCTS
route.get("/addproducts",adminProduct.addProductDisplay)

route.get("/productdelete/:product",adminProduct.deleteProduct)

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




//ORDERS
route.get("/orders",adminOrder.displayOrder)

//ORDER STATUS UPDATE
route.post("/updatestatus",adminOrder.updateOrderStatus)


route.get("/removeorder/:orderId",adminOrder.deleteOrder)


route.get("/orderdetails",adminOrder.displayOderDetails)




//COUPON
route.get("/coupon",(req,res)=>{
    res.render("adminCoupon")
})



//SIGNOUT ADMIN

route.get("/signout",userData.signout)



module.exports=route     


































