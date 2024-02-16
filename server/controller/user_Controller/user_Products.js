
const productData = require("../../model/product_details")

const cartData = require("../../model/user_cart")
const categoryData = require("../../model/category_Model")

const HomeImages = async (req, res) => {

    try {

        let enter = req.session.authenticated
        const images = await productData.find({})
        console.log(images)

        res.render("userHome", { images, enter })

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

        // const product = await productData.find({ list:0 })
        const category = await categoryData.find({ list: 0 })
        let currentPage = req.query.page || 0
        console.log(currentPage)

        if (req.query.next) {
            console.log("next entred")
            currentPage++

        }

        if (req.query.previous) {
            console.log("prev entred")
            // let nextValue=req.query.previous-2
            // // let skipValue=nextValue*3;
            // const product=await productData.find({list:0 }).skip(skipValue*3).limit(3)
            // nextValue++;
            // res.render("formalStore", { product, data: "All Collection",category,cat:"All Collection" ,nextValue,skipValue})
            currentPage--
        }
        const proCount = await productData.find({ list: 0 }).count()
        let countLimit = Math.ceil(proCount / 6);
        let countCurrent = currentPage + 1
        const product = await productData.find({ list: 0 }).skip(currentPage * 6).limit(6)

        res.render("formalStore", { product, data: "All Collection", category, cat: "All Collection", currentPage, countLimit, countCurrent })



        // let skipValue=nextValue*5;
        //    const product=await productData.find({list:0 }).skip(skipValue).limit(7)
        //    nextValue++;

        //    res.redirect("/allcollection",{nextData})

        // const formalCollection = await productData.find({ category: "formals" })
        // const casualCollection = await productData.find({ category: "Casuals" })

        // let previous=nextValue-1
        // let next=nextValue+2

        // res.render("formalStore", { product, data: "All Collection",category,cat:"All Collection" ,nextValue})x
    }
    catch (e) {
        console.log("error with the Allcollection " + e)
    }
}


const displayProduct = async (req, res) => {

    try {

        console.log("entered into the displayproduct")
        let cat = req.params.id
        console.log(req.params.id)
        let pagenationcat = cat
        let categoryFind = cat || req.query.nextcat || req.query.previouscat

        console.log("for pagenation " + req.query.nextcat + " " + req.query.previouscat)

        let currentPage=req.query.page || 0


        if(req.query.nextcat){
            currentPage++;

        }

        if(req.query.previouscat){
            currentPage--;

        }

       

        const category = await categoryData.find({ list: 0 })
        const product = await productData.find({ list: 0, category: categoryFind }).skip(currentPage*6).limit(6)
        console.log(product)

        res.render("formalStore", { product, category, categoryFind, pagenationcat,currentPage})

    }
    catch (e) {
        console.log(" error withe displayProduct" + e)
    }


}



const userSearchProduct = async (req, res) => {

    try {
        if (req.body.filter) {
            const category = await categoryData.find({ list: 0 })

            const filterProduct = req.body.filter

            const regex = new RegExp(`${filterProduct}`, 'i')

            const product = await productData.find({ productname: { $regex: regex } })

            res.render("formalStore", { product, filterProduct, category, cat: "All Collection" })


        } else {
            res.redirect("/allcollection")

        }


    }
    catch (e) {
        console.log()
    }


}



// const pagenation=async(req,res)=>{
//     try{


//     }
//     catch(e){
//             console.log("problem withe the pagenation"+e)
//     }
// }


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










module.exports = { productDetailPage, allCollectionDisplay, HomeImages, displayProduct, userSearchProduct }