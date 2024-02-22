const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData=require("../../model/user_Orders")




//CHECK  THE LOGIN OF ADMIN

const Login = async (req, res) => {

    try {

        console.log("entered to")

        console.log(req.body.username)
        console.log(req.body.password)

        const userValue = await userData.findOne({ username: req.body.username })

        if (userValue.isAdmin) {
            const checkPass = await bcrypt.compare(req.body.password, userValue.password)

            if (checkPass) {
                req.session.auth = true
                res.redirect("/admin/dashboard")
            }
            else {
                res.redirect("/admin?pass=Invalid Password")
            }

        }
        else {

            res.redirect("/admin?name=Invalid Password")

        }

        // console.log(userValue)



    }
    catch (e) {
        console.log(e)
    }

}


const signout = async (req, res) => {

    console.log("session destroyed 1")

    await req.session.destroy()

    console.log("session destroyed 2")

    res.redirect("/admin")

}




const displayPanel = async (req, res) => {

    try {

        if(req.session.auth){
            res.render("adminPanel")
            // res.redirect("/admin/dashboard")

        }

        res.render("adminLogin")

    }
    catch (e) {

        console.log(e)

    }
}

// // ADMIN SEARCH FOR SPECIFIC USER

// const searchUser = async (req, res) => {

//     try {

//         console.log("search user try entered")
//         if (req.body.filter) {

//             const filterUser = req.body.filter

//             const regex = new RegExp(`^${filterUser}`, 'i')

//             const value = await userData.find({ username: { $regex: regex } })



//             res.render("adminUsers", { value, filterUser })
//         }
//         else {
//             res.redirect("/admin/users")

//         }

//     }
//     catch (e) {
//         console.log(e)
//     }
// }



// //USED TO SEARCH THE PRODUCTS


// const searchProduct = async (req, res) => {

//     try {

//         console.log("search product try entered")
//         if (req.body.filter) {

//             const filterProduct = req.body.filter

//             const regex = new RegExp(`^${filterProduct}`, 'i')

//             const productList = await productData.find({ productname: { $regex: regex } })



//             res.render("adminProducts", { productList, filterProduct })
//         }
//         else {
//             res.redirect("/admin/products")

//         }

//     }
//     catch (e) {
//         console.log(e)
//     }
// }





// //BLOCK AND UN BLOCK THE USER 

// const blockUser = async (req, res) => {

//     try {
//         if (req.params.username) {
//             console.log("entered the blockuser")
//             const emailValue = req.params.username
//             console.log(req.params.username)
//             const user = await userData.findOne({ username: emailValue })

//             let val = 1

//             if (user.status) {
//                 val = 0


//             }


//             const blockData = await userData.updateOne({ username: emailValue }, { $set: { status: val } })
//             res.redirect("/admin/users")

//         }

//     }
//     catch (e) {

//         console.log(e)

//     }
// }



//IMAGES UPLOADING  USING MULTER

// async function productDetails(link, data) {

//     console.log(data.productname)
//     console.log(link)
//     const newProduct = new productData({

//         productname: data.productname,
//         category: data.category,
//         price: data.price,
//         description: data.description,
//         color: data.color,
//         waranty: data.waranty,
//         imagepath: link

//     })

//     await newProduct.save()
// }

// const productDetails = async (req, res) => {
//     try {

//         console.log(req.body)
//         let data = req.body
//         console.log(data.stock)
//         console.log(req.files)
//         let imagePath = []
//         console.log("adata saveed")

//         imagePath[0] = req.files[0].path.replace(/\\/g, "/").replace('public/', '/')
//         imagePath[1] = req.files[1].path.replace(/\\/g, "/").replace('public/', '/')
//         imagePath[2] = req.files[2].path.replace(/\\/g, "/").replace('public/', '/')
//         imagePath[3] = req.files[3].path.replace(/\\/g, "/").replace('public/', '/')
//         console.log("adata saveed")
//         const newProduct = new productData({

//             productname: data.productname,
//             category: data.category,
//             price: data.price,
//             description: data.description,
//             color: data.color,
//             waranty: data.waranty,
//             imagepath: imagePath,
//             list:0,
//             display:0,
//             stock: data.stock

//         })

//         await newProduct.save()
//         console.log("adata saveed")
//         res.redirect("/admin/addproducts?success=Data Uploaded Successfully")
//     }

//     catch (e) {
//         console.log("problem with the productdetails" + e)
//     }


// }

// const categoryDelete = async (req, res) => {
//     try {

//         if (req.params.catId) {
//             console.log(req.params.catId)

//             const catDel = await catData.deleteOne({ category: req.params.catId })
//         }
//         res.redirect("/admin/category")

//     }
//     catch (e) {
//         console.log("this is the mistake of the categort delete" + e)
//     }
// }

// const productDetails=async(req,res)=>{



//    try{
//     if(req.file)
//     {
//         console.log(req.file)
//         console.log("befor body")
//         const fileData=req.file

//         const newProduct=new productData({

//             productname:req.body.productname,
//             category:req.body.category,
//             price:req.body.price,
//             description:req.body.description,
//             color:req.body.color,
//             waranty:req.body.waranty,
//             imagepath:fileData.path

//         })

//         await newProduct.save();

//         res.redirect("/admin/addproducts?success=Data Uploaded Successfully")


//     }


//    }
//     catch(e){

//         console.log(e)
//     }

// }



// //DISPLAY THE PRDUCTS IN ADMIN PRODUCT PAGE

// const productDisplay = async (req, res) => {

//     try {
//         console.log("entered ordvt displaye")
//         const productList = await productData.find({})
//         const success = req.query.success
//         //  console.log(productList.list)
//         //  console.log(productList)

//          console.log("enterd if")

//         if (productList) {
            
//          console.log("enterd if hghbjjnjnjnjnj")
//         //  console.log(productList[0].list)
//             // if(productList.list==0)
//             // {
//             //     console.log("enterd if")
//             //     res.render("adminProducts", { productList, success })
//             // }
//             res.render("adminProducts", { productList, success })
          
//         }


//     }
//     catch (e) {
//         console.log(e)
//     }
// }


// //DISPLAY THE CATEGORY DETAILS FOR THE CATEGORY PAGE

// const categoryDetails = async (req, res) => {

//     try {


//         console.log("entered into the categorydetails")
//         const categoryData = await catData.find({})

//         console.log(req.query.edit)
//         let success=req.query.edit

//          console.log(categoryData[0].list)

//         // console.log(categoryData)

//         // console.log(req.params.value)

//         // const count=await productData.aggregate([{$group:{_id:"$category",count:{$sum:1}}}])

//         res.render("adminCategory", { categoryData,success })

//         // console.log(categoryData)
//         // console.log(count)


//     }
//     catch (e) {
//         console.log(e)
//     }

// }



// //SAVE CATEGORY TO CATEGORY DATABASE

// const storeCategory = async (req, res) => {
//     try {

//         console.log(req.body.category)
//         const newCategory = new catData({

//             category: req.body.category,
//             list: 0

//         })

//         await newCategory.save()
//         console.log(newCategory)

//         res.redirect("/admin/category")

//     }
//     catch {

//         console.log("The prblem with category to database")
//     }
// }


// //ADD PRODUCT DISPLAY

// const addProductDisplay = async (req, res) => {

//     try {
//         const successData = req.query.success
//         const categorydata = await catData.find({})
//         res.render("addProducts", { successData, categorydata })
//     }
//     catch (e) {
//         console.log(e)
//     }
// }

// // LIST AND UNLIST THE COLLECTIONS

// const list = async (req, res) => {



//     try {
//         console.log("list try entered")

//         console.log(req.params.category)

//         const data = await catData.find({ category: req.params.category })

//         let val = 1;

//         console.log(data[0].list)

//         if (data[0].list == 1) {

//             val = 0

//         }

//         const list = await productData.updateMany({ category: req.params.category }, { $set: { list: val } })
//         const list2 = await catData.updateMany({ category: req.params.category }, { $set: { list: val } })

//         res.redirect("/admin/category")

//     }
//     catch (e) {
//         console.log(e)
//     }


// }




// const deleteProduct = async (req, res) => {


//     try {

//         console.log(req.params.product + "DBDHBDJND")

//         const productList = await productData.findOne({ productname: req.params.product })

//         // console.log(productList)
//          let val=0

//             if(productList.display==0)
//             {
//                 console.log("heeloooo")
//                val=1
            
//             }
            
       
//         const list2 = await productData.updateOne({ productname: req.params.product}, { $set: { display: val } })
//         console.log(list2)

//         res.redirect("/admin/products")

//     }
//     catch (e) {
//         console.log(e)
//     }

// }


// const editProduct = async (req, res) => {

//     try {

//         console.log("edit product" + req.params.edit)

//         if (req.params.edit) {

//             console.log("edit enetered")
//             const editData = await productData.findOne({ productname: req.params.edit })

//             console.log(editData)

//             res.render("editProduct", { editData })
//         }

//     }
//     catch (e) {
//         console.log(e)
//     }

// }



// const updateProduct = async (req, res) => {

//     try {

//         console.log(req.body)

//         if (req.body) {

//             console.log("update entered")

//             console.log(req.body)

//             const oldname = req.body.oldproductname
//             const newname = req.body.productname
//             const category1 = req.body.category
//             const price = req.body.price
//             const description = req.body.description
//             const color = req.body.color
//             const waranty = req.body.waranty
//             const stock = req.body.stock
//             const update = await productData.updateOne({ productname: oldname }, { $set: { productname: newname, category: category1, price: price, description: description, color: color, waranty: waranty, stock:stock } })

//             console.log(update)

//             res.redirect("/admin/products")


//         }
//         else {

//             res.redirect("/admin/products")
//         }

//     }
//     catch (e) {
//         console.log(e)
//     }


// }

// const editCategory=async(req,res)=>{

//   try{
//     console.log("editr category")
//     console.log(req.params.catid)

//     if(req.params.catid)
//     { 
//         console.log(req.body.categoryname)
       

//         const changecat=await catData.findOne({category:req.params.catid})
//         await catData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname}})

//         // const changepro=await productData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname}})

//         console.log(changecat)
//         // console.log(changepro)

//         res.redirect("/admin/category?edit=Successfully Edited")
//     }

//   }
//   catch(e)
//   {
//     console.log("This is editCategory error "+e)
//   }


// }



// //ORDERS DISPLAY PAGE

// const displayOrder=async(req,res)=>{
   
//     try{

//         const orderValue=await orderData.find({})

//         res.render("adminOrders",{orderValue});

//     }
//     catch(e)
//     {
//         console.log("problem withe the displayOrder")
//     }

// }

// //UPDATE THE ORDER STATUS

// const updateOrderStatus=async(req,res)=>{

//     try{

//         console.log("proId"+req.params.orderid)
//         // console.log("proId"+req.params.proId)
//         // console.log("proId"+req.params.userId)
//     //  console.log(req.query)

//        console.log(req.body.category)




//        const updateData=await orderData.updateOne({orderId:req.params.orderid},{$set:{status:req.body.category}})


       

//        console.log(updateData)

//        res.redirect("/admin/orders")

//     }
//     catch(e){
//         console.log("Problem withe the updateOrderStatus"+e)
//     }

// }


// const deleteOrder=async(req,res)=>{
//   try{

// console.log(req.params.orderId)


//     const deleteData= await orderData.deleteOne({orderId:req.params.orderId})
//     console.log(deleteData)
//     res.redirect("/admin/orders")


//   }
//   catch(e){

//     console.log("problem withe the deleteOrder"+e)
//   }

// }



// const displayOderDetails=async(req,res)=>{
 
//     try{

//         console.log(req.params.orderId)


//         const orderDetails=await orderData.findOne({orderId:req.params.orderId})
        
//         const image=await productData.findOne({productname:orderDetails.productname})
//         console.log(orderDetails.productname)

//         console.log(image)

//         console.log(image.imagepath[0])

//         let img=image.imagepath[0]


//         res.render("adminOrderdetails",{orderDetails,img})

//     }
//     catch(e){
//         console.log("problem withe the ")
//     }

    



// }






module.exports = {
    Login,
    signout,
    displayPanel
}