
const productData = require("../../model/product_details")

const cartData = require("../../model/user_cart")
const categoryData = require("../../model/category_Model")





//RENDER THE HOME PAGE 

const renderHome=async(req,res)=>{
  
    try{

      let enter=req.session.authenticated
      const images = await productData.find({list:0}).limit(12)
    

        res.render("userHome",{enter,images})

    }
    catch(e)
    {
        console.log(e)
        res.redirect("/error")
    }

}









const HomeImages = async (req, res) => {

    try {
   console.log("entered to homeimages")
        let enter = req.session.authenticated
        if(req.session.authenticated){

            const images = await productData.find({ list: 0 })
            console.log(images)
    
            res.render("userHome", { images, enter })

        }else{
            res.redirect("/home")
        }
       

    }
    catch (e) {
        console.log(e)
        res.redirect("/error")
    }

}



// const categoryDisplay=async(req,res)=>{
//     try{

//         console.log(req.query.category)


//     }catch(e){
//         console.log("problem with the categoryDisplay"+e)
//         res.redirect("/error")
//     }
// }



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
        res.redirect("/error")
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
        let allcollection="allcollection"

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

        res.render("formalStore", { product, data: "All Collection", category, cat: "All Collection",allcollection, currentPage, countLimit, countCurrent })



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
        res.redirect("/error")
    }
}



const displayProduct = async (req, res) => {
    try {

        console.log("entered into the displayproduct")
        let cat = req.params.id
        console.log(req.params.id)
        let pagenationcat = cat
        let categoryFind = cat || req.query.nextcat || req.query.previouscat
        let displayProduct="displayProduct"

        if(categoryFind){
            pagenationcat = categoryFind
        }


        console.log("checking the pagenation cart vlue-----------------------------"+pagenationcat)


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
        res.render("formalStore", { product, category, categoryFind, pagenationcat,currentPage,displayProduct})

    }
    catch (e) {
        console.log(" error withe displayProduct" + e)
        res.redirect("/error")
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
            // res.redirect("/error")

        }


    }
    catch (e) {
        console.log()
        res.redirect("/error")
    }


}


const lowToHigh=async(req,res)=>{
    try{
        console.log("entered in to the low to high display")
        console.log(req.query.data)
        // const product = await productData.find({ list:0 })
        const category = await categoryData.find({ list: 0 })
        let currentPage = req.query.page || 0
        console.log(currentPage)
        let pagenationcat=req.query.data
        let sort="success"
        let lowtohigh
        let lowtohighcat

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
        let product
        let cat
        let categoryFind
    
        
        if(!req.query.data){
            console.log("enteredd into the if")
           product = await productData.find({ list: 0 }).skip(currentPage* 6).limit(6).sort({price:1})
           console.log(product.length+ " length of cominhg product")
           cat="All Collection"
           lowtohigh="lowToHigh"
        }else{
            console.log("enteredd into the else")
           product = await productData.find({category:req.query.data, list: 0 }).skip(currentPage * 6).limit(6).sort({price:1})
           categoryFind=req.query.data
           lowtohighcat="lowtohigh"
        }

        res.render("formalStore", { product, data: "All Collection", category, cat: "All Collection", currentPage,pagenationcat, countLimit,lowtohigh,lowtohighcat, countCurrent,categoryFind })

    }catch(e){
        console.log("problem with the lowToHigh"+e)
        res.redirect("/error")
    }
}




const HightoLow=async(req,res)=>{
    try{
        console.log("entered in to the high  h display")

        console.log(req.query.data)

        let sort="success"
        let hightolow
        let pagenationcat=req.query.data
       
        // const product = await productData.find({ list:0 })
        const category = await categoryData.find({ list: 0 })
        let currentPage = req.query.page || 0
        console.log(currentPage)
        let  hightolowcat

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

        let product
        let cat
        let categoryFind
        if(!req.query.data){
             product = await productData.find({ list: 0 }).skip(currentPage * 6).limit(6).sort({price:-1})
             cat="All Collection"
             hightolow="hightolow"
        }else{
             product = await productData.find({category:req.query.data, list: 0 }).skip(currentPage * 6).limit(6).sort({price:-1})
             categoryFind=req.query.data
             hightolowcat="hightolow"
        }

        
        
        res.render("formalStore", { product, data: "All Collection", category, cat: "All Collection", currentPage,pagenationcat, countLimit,hightolow,hightolowcat, countCurrent,categoryFind })

    }catch(e){
        console.log("problem with the lowToHigh"+e)
        res.redirect("/error")
    }
}



const displayCatHightoLow = async (req, res) => {

    try {

        console.log("entered into the displayCatHightoLow")
        let cat = req.params.id
        console.log(req.params.id)
        let pagenationcat = cat
        let categoryFind = cat || req.query.nextcat || req.query.previouscat
        let hightolowcat="hightolow"
        

        console.log("for pagenation " + req.query.nextcat + " " + req.query.previouscat)

        let currentPage=req.query.page || 0


        if(req.query.nextcat){
            currentPage++;

        }

        if(req.query.previouscat){
            currentPage--;

        }

       

        const category = await categoryData.find({ list: 0 })
        const product = await productData.find({ list: 0, category: categoryFind }).skip(currentPage*6).limit(6).sort({price:-1})
        console.log(product)

        res.render("formalStore", { product, category, categoryFind, pagenationcat,currentPage,hightolowcat})

    }
    catch (e) {
        console.log(" error withe displayProduct" + e)
        res.redirect("/error")
    }


}




const displayCatLowtoHigh = async (req, res) => {

    try {

        console.log("entered into the displayproduct")
        let cat = req.params.id
        console.log(req.params.id)
        let pagenationcat = cat
        let categoryFind = cat || req.query.nextcat || req.query.previouscat
        let lowtohighcat="lowtohigh"
        
        console.log("for pagenation " + req.query.nextcat + " " + req.query.previouscat)

        let currentPage=req.query.page || 0


        if(req.query.nextcat){
            currentPage++;

        }

        if(req.query.previouscat){
            currentPage--;

        }

       

        const category = await categoryData.find({ list: 0 })
        const product = await productData.find({ list: 0, category: categoryFind }).skip(currentPage*6).limit(6).sort({price:1})
        console.log(product)

        res.render("formalStore", { product, category, categoryFind, pagenationcat,currentPage,lowtohighcat})

    }
    catch (e) {
        console.log(" error withe displayProduct" + e)
        res.redirect("/error")
    }


}






module.exports = { productDetailPage, allCollectionDisplay, HomeImages, displayProduct, userSearchProduct,lowToHigh,HightoLow,renderHome,displayCatHightoLow ,displayCatLowtoHigh}