const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData = require("../../model/user_Orders")
var fs = require('fs');
const sharp = require('sharp');
var path = require('path');




//DISPLAY THE PRDUCTS IN ADMIN PRODUCT PAGE

const productDisplay = async (req, res) => {

    try {
        console.log("entered ordvt displaye")
        let currentValue = req.query.page || 0

        if (req.query.next) {
            currentValue++

        }

        if (req.query.previous) {
            currentValue--

        }

        const productList = await productData.find({}).skip(currentValue * 6).limit(6).sort({ _id: -1 })

        // const productList = await productData.find({}).sort({_id:-1})
        const success = req.query.success
        //  console.log(productList.list)
        //  console.log(productList)

        console.log("enterd if")
       let categorydata 
       categorydata = await catData.find({})
        // const categorydata=await catData.find([{}])

        console.log(categorydata+"loooking the catr data")
        console.log(categorydata.category)

        if (productList) {

            console.log("enterd if hghbjjnjnjnjnj")
            //  console.log(productList[0].list)
            // if(productList.list==0)
            // {
            //     console.log("enterd if")
            //     res.render("adminProducts", { productList, success })
            // }
            res.render("adminProducts", { productList, success, currentValue,categorydata })

        }


    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }
}




const productDetails = async (req, res) => {
    try {

        console.log(req.body)
        console.log(req.body['offer-percentage'])
        let data = req.body
        console.log(data.stock)
        console.log(req.files)
        let imagePath = []
        console.log("productDetails saveed")



        // imagePath[0] = req.files[0].path.replace(/\\/g, "/").replace('public/', '/')
        // imagePath[1] = req.files[1].path.replace(/\\/g, "/").replace('public/', '/')
        // imagePath[2] = req.files[2].path.replace(/\\/g, "/").replace('public/', '/')
        // imagePath[3] = req.files[3].path.replace(/\\/g, "/").replace('public/', '/')
        console.log("adata saveed")
        const filter = req.body.productname
        const regex = new RegExp(`^${filter}`, 'i')

        const AlreadyProduct = await productData.findOne({ productname: { $regex: regex } })
        console.log(AlreadyProduct)
        if (AlreadyProduct) {
            console.log("Already Presented")
            res.redirect("/admin/addproducts?success=Productname Already presented")
        } else {


            //================================================start crop image==========================================
            const files = req.files;
            const uploadedImages = [];
            let fileName
            let filePath

            for (const file of files) {
                const resizedImageBuffer = await sharp(file.path)
                    .resize({ width: 1000, height: 1000 }) // Set your desired dimensions
                    .toBuffer();


                fileName = Date.now() + '-' + file.originalname; // Use a function to generate a unique filename
                filePath = path.join('./public/images/', fileName);
                console.log(filePath, 'filePath kitti--------------')

                // Write the resized image buffer to the file
                fs.writeFileSync(filePath, resizedImageBuffer);

                // Process or store the resized image buffer as needed
                uploadedImages.push({
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: resizedImageBuffer.length,
                    buffer: resizedImageBuffer,
                    path: filePath
                });
            }
            for (const image of uploadedImages) {
                console.log(image)
            }


            //-----------------------------------------------end file crop ---------------------------------------------------

            for (let i = 0; i < uploadedImages.length; i++) {
                console.log(uploadedImages[i].path)
                imagePath[i] = uploadedImages[i].path.replace(/\\/g, "/").replace('public/', '/')
            }


            let checkOffer=req.body['offer-percentage'] 
            let OfferPrice 
            //----------------------------------------------
            const categoryOffer=await catData.findOne({category:data.category})
            let offer
            if(req.body['offer-percentage']>=categoryOffer.offer){
                offer=req.body['offer-percentage']
            }else{
                offer=categoryOffer.offer 
            }
            console.log("after checking"+offer)

            if(!offer){
                offer=0
            }

            console.log("after 2nd  checking"+offer)

            //----------------------------------------------
            if(checkOffer){
                OfferPrice = Math.floor(req.body.price - (req.body.price * (offer / 100)));
                console.log("Offer Price:", OfferPrice);
            }else{
                OfferPrice = req.body.price 
            }
      console.log(OfferPrice)

            // let offer
            // if(product[i].offer>=categoryOffer.offer){
            //     offer=product[i].offer
            // }else{
            //     offer=categoryOffer.offer 
            // }
            // let OfferPrice =Math.floor(product[i].price - (product[i].price * (offer/ 100))) 
            // console.log(OfferPrice)




            const newProduct = new productData({

                productname: data.productname,
                category: data.category,
                price: data.price,
                description: data.description,
                color: data.color,
                waranty: data.waranty,
                imagepath: imagePath,
                list: 0,
                display: 0,
                stock: data.stock,
                offer: data['offer-percentage'],
                offerprice: OfferPrice

            })

            await newProduct.save()
            console.log("adata saveed")
            res.redirect("/admin/addproducts?success=Data Uploaded Successfully")
        }
    }

    catch (e) {
        console.log("problem with the productdetails" + e)
        res.redirect("/admin/error")
    }


}





//USED TO SEARCH THE PRODUCTS


const searchProduct = async (req, res) => {

    try {

        console.log("search product try entered")
        if (req.body.filter) {

            const filterProduct = req.body.filter

            const regex = new RegExp(`^${filterProduct}`, 'i')

            const productList = await productData.find({ productname: { $regex: regex } })



            res.render("adminProducts", { productList, filterProduct })
        }
        else {
            res.redirect("/admin/products")

        }

    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }
}



//ADD PRODUCT DISPLAY

const addProductDisplay = async (req, res) => {

    try {
        const successData = req.query.success
        const categorydata = await catData.find({})
        res.render("addProducts", { successData, categorydata })
    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }
}




const deleteProduct = async (req, res) => {


    try {

        console.log(req.params.product + "DBDHBDJND")

        const productList = await productData.findOne({ productname: req.params.product })

        // console.log(productList)
        let val = 0

        if (productList.display == 0) {
            console.log("heeloooo")
            val = 1

        }


        const list2 = await productData.updateOne({ productname: req.params.product }, { $set: { display: val } })
        console.log(list2)

        res.redirect("/admin/products")

    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }

}


const editProduct = async (req, res) => {

    try {

        console.log("edit product" + req.params.edit)

        if (req.params.edit) {

            console.log("edit enetered")
            const editData = await productData.findOne({ productname: req.params.edit })

            console.log(editData)

            res.render("editProduct", { editData })
        }

    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }

}



const updateProduct = async (req, res) => {
    try {

        console.log('enter updateProduct!!!')
        console.log(req.body)
        console.log('after req.body')
        console.log(req.files)
        console.log('req.files')



        const files = req.files;
        const uploadedImages = [];
        let fileName
        let filePath
        let imagePath = []
        for (const file of files) {
            const resizedImageBuffer = await sharp(file.path)
                .resize({ width: 1000, height: 1000 }) // Set your desired dimensions
                .toBuffer();


            fileName = Date.now() + '-' + file.originalname; // Use a function to generate a unique filename
            filePath = path.join('./public/images/', fileName);
            console.log(filePath, 'filePath kitti--------------')

            // Write the resized image buffer to the file
            fs.writeFileSync(filePath, resizedImageBuffer);

            // Process or store the resized image buffer as needed
            uploadedImages.push({
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: resizedImageBuffer.length,
                buffer: resizedImageBuffer,
                path: filePath
            });
            let img = []
            for (let i = 0; i < uploadedImages.length; i++) {
                img[i] = uploadedImages[i].path.replace(/\\/g, "/").replace('public/', '/')
                await productData.updateOne(
                    { productname: req.body.productname },
                    { $set: { [`imagepath.${i}`]: img[i] } }
                )
            }
        }
        for (const image of uploadedImages) {
            console.log(image)
        }


        //-----------------------------------------------a bug here when we are uodating one other images are not added its removed???????? ---------------------------------------------------

        for (let i = 0; i < uploadedImages.length; i++) {
            console.log(uploadedImages[i].path)
            imagePath[i] = uploadedImages[i].path.replace(/\\/g, "/").replace('public/', '/')
        }

        // let checkOffer=req.body['offer-percentage'] 
        // let OfferPrice 
        // if(checkOffer){
        //     OfferPrice = Math.floor(req.body.price - (req.body.price * (req.body['offer-percentage'] / 100)));
        //     console.log("Offer Price:", OfferPrice);
        // }else{
        //     OfferPrice =req.body.price 
        // }



        
        let checkOffer=req.body['offer-percentage'] 
        let OfferPrice 
        //----------------------------------------------
        const categoryOffer=await catData.findOne({category:req.body.category})
        console.log(categoryOffer + " database")
        console.log(categoryOffer.offer + "  checking the category iffer")
        let offer
        if(req.body['offer-percentage']>=categoryOffer.offer){
            console.log(" greater if   check")
            offer=Number(req.body['offer-percentage'])
        }else{
            console.log(" greater else   check")
            offer=Number(categoryOffer.offer )
            console.log(offer)
        }
          if(!offer){
                offer=0
            }

        //----------------------------------------------
        if(checkOffer){
            console.log( "ifffffff")
            console.log(req.body.price)
            console.log(offer)
            console.log(typeof(offer))
            OfferPrice = Math.floor(req.body.price - (req.body.price * (Number(offer) / 100)));
            console.log("Offer Price:", OfferPrice);
        }else{
            OfferPrice = req.body.price 
            console.log( "else ....."+OfferPrice    )

        }


        console.log(OfferPrice + " offerr price checking chercking fjbdknkmdkmdmlml")



        console.log(req.body)

        if (req.body) {

            console.log("update entered")

            console.log(req.body)

            const oldname = req.body.oldproductname
            const newname = req.body.productname
            const category1 = req.body.category
            const price = req.body.price
            const description = req.body.description
            const color = req.body.color
            const waranty = req.body.waranty
            const stock = req.body.stock
            const update = await productData.updateOne({ productname: oldname }, { $set: { productname: newname, category: category1, price: price, description: description, color: color, waranty: waranty, stock: stock, offer: req.body['offer-percentage'], offerprice:OfferPrice  } })

            console.log(update)

            res.redirect("/admin/products")


        }
        else {

            res.redirect("/admin/products")
        }

    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }


}



const productPagenation = async (req, res) => {
    try {

        let currentValue = req.query.page || 0

        if (req.query.next) {
            currentValue++

        }

        if (req.query.previous) {
            currentValue--

        }
        res.render("adminProducts", { currentValue })

    } catch (e) {
        console.log("problem withe the productPagenation" + e)
        res.redirect("/admin/error")
    }
}

module.exports = {
    productDisplay,
    productDetails,
    searchProduct,
    addProductDisplay,
    deleteProduct,
    editProduct,
    updateProduct,
    productPagenation,


}