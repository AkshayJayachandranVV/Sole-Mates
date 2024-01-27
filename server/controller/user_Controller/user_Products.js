
const productData = require("../../model/product_details")

const cartData=require("../../model/user_cart")
const categoryData=require("../../model/category_Model")

const HomeImages = async (req, res) => {

    try {

       let enter=req.session.authenticated
        const images = await productData.find({})
        console.log(images)

        res.render("userHome", { images,enter })

    }
    catch (e) {
        console.log(e)
    }

}



const productDetailPage = async (req, res) => {

    try {
        console.log("product details data : " + req.params.id)
        const value = req.params.id
        if (req.params.id) {
            console.log("insdie product detail")
            const productD = await productData.findOne({ productname: req.params.id })

            console.log(productD)
            console.log(req.method)
            
 
            if (productD) {

                // const { productname, category, price, description, imagepath } = productD;

                res.render("detailsProduct", { productD })
                // Rest of your code using the extracted properties
            } else {
                // Handle the case where productDetail is not defined
                console.error("productDetail is not defined");
            }

            // const { productname, category, price, description, imagepath } = productDetail


            //res.render("productDetails")
        }
    }
    catch (e) {
        console.log(e)
    }
}







//ALL COLLECTION DATA 

const allCollectionDisplay = async (req, res) => {


    try {
        console.log("entered in to the allcollection display")

        const product = await productData.find({ list:0 })
        const category=await categoryData.find({list:0})
      
        // const formalCollection = await productData.find({ category: "formals" })
        // const casualCollection = await productData.find({ category: "Casuals" })

        res.render("formalStore", { product, data: "All Collection",category,cat:"All Collection" })
    }
    catch (e) {
        console.log("error with the Allcollection "+e)
    }
}


const displayProduct=async(req,res)=>{

 try{

    console.log("entered into the displayproduct")
    let cat=req.params.id 
    console.log(req.params.id )

     const category=await categoryData.find({list:0})
    const product = await productData.find({ list: 0,category:req.params.id })
     console.log(product)

    res.render("formalStore", { product,category,cat })

 }
 catch(e)
 {
    console.log(" error withe displayProduct"+e)
 }


}



const userSearchProduct=async(req,res)=>{

    try{
        if (req.body.filter) {
            const category=await categoryData.find({list:0})

            const filterProduct = req.body.filter

            const regex = new RegExp(`^${filterProduct}`, 'i')

            const product= await productData.find({ productname: { $regex: regex } })

            res.render("formalStore", { product, filterProduct,category,cat:"All Collection" })

          
        } else {
            res.redirect("/allcollection")

        }
       

      

    }
    catch(e){
        console.log()
    }


}


// // FORMAL DISPLAY CODE AND TAKING DATA IN DB
// const formalDisplay = async (req, res) => {

//     try {

//         const product = await productData.find({ $and: [{ category: "formals" }, { list: 0 }] })
//         console.log(product)

//         res.render("formalStore", { product, data: "Formal Store" })

//     }
//     catch (e) {
//         console.log(e)
//     }

// }




// // FORMAL DISPLAY CODE AND TAKING DATA IN DB
// const casualDisplay = async (req, res) => {

//     try {

//         const product = await productData.find({ $and: [{ category: "casuals " }, { list: 0 }] })
//         console.log(product)

//         res.render("formalStore", { product, data: "Casual Store" })

//     }
//     catch (e) {
//         console.log(e)
//     }


// }










module.exports={productDetailPage,allCollectionDisplay,HomeImages,displayProduct,userSearchProduct}