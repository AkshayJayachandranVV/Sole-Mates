const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData = require("../../model/user_Orders")


//DISPLAY THE PRDUCTS IN ADMIN PRODUCT PAGE

const productDisplay = async (req, res) => {

    try {
        console.log("entered ordvt displaye")
        const productList = await productData.find({})
        const success = req.query.success
        //  console.log(productList.list)
        //  console.log(productList)

        console.log("enterd if")

        if (productList) {

            console.log("enterd if hghbjjnjnjnjnj")
            //  console.log(productList[0].list)
            // if(productList.list==0)
            // {
            //     console.log("enterd if")
            //     res.render("adminProducts", { productList, success })
            // }
            res.render("adminProducts", { productList, success })

        }


    }
    catch (e) {
        console.log(e)
    }
}




const productDetails = async (req, res) => {
    try {

        console.log(req.body)
        let data = req.body
        console.log(data.stock)
        console.log(req.files)
        let imagePath = []
        console.log("adata saveed")

        for (let i = 0; i < req.files.length; i++) {
            imagePath[i] = req.files[i].path.replace(/\\/g, "/").replace('public/', '/')
        }

        // imagePath[0] = req.files[0].path.replace(/\\/g, "/").replace('public/', '/')
        // imagePath[1] = req.files[1].path.replace(/\\/g, "/").replace('public/', '/')
        // imagePath[2] = req.files[2].path.replace(/\\/g, "/").replace('public/', '/')
        // imagePath[3] = req.files[3].path.replace(/\\/g, "/").replace('public/', '/')
        console.log("adata saveed")
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
            stock: data.stock

        })

        await newProduct.save()
        console.log("adata saveed")
        res.redirect("/admin/addproducts?success=Data Uploaded Successfully")
    }

    catch (e) {
        console.log("problem with the productdetails" + e)
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
    }

}



const updateProduct = async (req, res) => {

    try {

        console.log('enter updateProduct!!!')
        console.log(req.body.productname)
        console.log('after req.body')
        console.log(req.files)
        console.log('req.files')

        let img = []
        for (let i = 0; i < req.files.length; i++) {
            img[i] = req.files[i].path.replace(/\\/g, "/").replace('public/', '/')
            await productData.updateOne(
                { productname: req.body.productname },
                { $set: { [`imagepath.${i}`]: img[i] } }
            )
        }

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
            const update = await productData.updateOne({ productname: oldname }, { $set: { productname: newname, category: category1, price: price, description: description, color: color, waranty: waranty, stock:stock } })

            console.log(update)

            res.redirect("/admin/products")


        }
        else {

            res.redirect("/admin/products")
        }

    }
    catch (e) {
        console.log(e)
    }


}

module.exports = {
    productDisplay,
    productDetails,
    searchProduct,
    addProductDisplay,
    deleteProduct,
    editProduct,
    updateProduct

}