const user = require("../../model/user_register")

const productData = require("../../model/product_details")


const cartData = require("../../model/user_cart")





//MIDDLEWARE TO CHECK THE USER LOGIN TO GIVE AUTHORIZATION

const userAuthorize = async (req, res, next) => {

    try {

        if (req.session.authenticated) {

            // const displayCart= await cartData.find({username:req.session.username})           

            // res.render("addToCart",{displayCart})

            next()


        }
        else {
            res.redirect("/userLogin")
        }

    }
    catch (e) {
        console.log(e)
        res.redirect("/error")
    }
}

// ADD TO CART

const addToCart = async (req, res) => {

    try {

        console.log("helooo to add to art ---------------------------------------------------")

        if (req.body.productId) {

            console.log(req.body.productId)
            console.log(req.session.username)
            const cartCheck = await cartData.findOne({username:req.session.username, productname: req.body.productId })

            if(cartCheck){
                // res.redirect("/cart")

                return res.json({ success: false})

            }
            else{

            const addCart = await productData.findOne({ productname: req.body.productId })


            console.log(addCart.productname)
            console.log(addCart.category)
            console.log(addCart.imagepath[0])
            console.log(req.session.username)

            // imagePath[1] = addCart.imagepath[1].path
            // imagePath[2] = addCart.imagepath[2].path
            // imagePath[3] = addCart.imagepath[3].path

            const userdata = req.session.username

            const newCart = new cartData({

                imagepath: addCart.imagepath[0],
                productname: addCart.productname,
                price: addCart.offerprice,
                removevalue: 0,
                username: req.session.username,
                quantity: 1,
                category:addCart.category


            })
            await newCart.save()

            console.log("cart added succesfully")

            return res.json({ success: true})

            // const displayCart = await cartData.find({ username: req.session.username })

            // res.redirect("/cart")
        }

        }



    }
    catch (e) {

        console.log("error in the addToCart part" + e)
        res.redirect("/error")

    }
}



const cartDisplay = async (req, res) => {


    try {
        console.log("entere the cartdisplay")
        console.log(req.session.username)
        const displayCart = await cartData.find({ username: req.session.username })

        const totalprice = await cartData.aggregate([
            {
                $match: { username: req.session.username }
            },
            {
                $group: { _id: "$productname", price: { $sum: "$price" }, quantity: { $sum: "$quantity" } }
            },
            {
                $project: { _id: 0, amount: { $multiply: ["$price", "$quantity"] } }
            },
            {
                $group: { _id: "null", total: { $sum: "$amount" } }
            }
        ])
        console.log("after the total price")
        console.log(totalprice)
        let totalAmount

        if (totalprice.length < 1) {
            totalAmount = 0
        }
        else {
            console.log(totalprice[0].total)
            totalAmount = totalprice[0].total

        }



        // console.log(displayCart.quantity)   
        console.log(displayCart)
        const cartlen = await cartData.find({ username: req.session.username }).countDocuments()
        console.log(cartlen)

        res.render("addToCart", { displayCart, cartlen, totalAmount })

    }
    catch (e) {
        console.log("The error with cartDisplay" + e)
        res.redirect("/error")

    }
}



const cartRemoving = async (req, res) => {

    try {

        console.log(req.params.proId)

        if (req.params.proId) {
            console.log("entered into the cart rmoval")
            const deleteData = await cartData.deleteOne({ username: req.session.username }, { productname: req.params.proId })

            //i have changed gere i added to find the product withe username in the session to delete the cart of the particular user
            // const deleteDt=await cartData.findOne({productname:req.params.proId})
            console.log(deleteData)
        }




        res.redirect("/cart")
        // res.render("addToCart",{displayCart})

    }
    catch (e) {
        console.log("the error is present in cartRemoving")
        res.redirect("/error")
    }



}



const incrementData = async (req, res) => {
    try {
        console.log("incrment data")

        console.log("hyyy to increment")


        const userquantity = await cartData.updateOne({ $and: [{ username: req.session.username }, { productname: req.params.proId }] }, { $inc: { quantity: 1 } })


        //   const cartValue=await cartData.findOne({$and:[{username:req.session.username},{productname:req.params.proId}]})
        //   console.log(cartValue.price)
        //   console.log(cartValue.quantity)

        console.log(userquantity)

        res.redirect("/cart")

    }
    catch (e) {
        console.log("Problem with the incrementData" + e)
        res.redirect("/error")
    }
}




const decrementData = async (req, res) => {
    try {
        console.log("hyyy to decrement")



        const userquantity = await cartData.updateOne({ $and: [{ username: req.session.username }, { productname: req.params.proId }] }, { $inc: { quantity: -1 } })
        console.log(userquantity)

        res.redirect("/cart")

    }
    catch (e) {
        console.log("Problem with the incrementData" + e)
        res.redirect("/error")
    }
}



const updateQuantity = async (req, res) => {
    try {
        let quantity
        let totalAmount

        console.log("updatewQuantity................-------------------------------------")
        // console.log(req.body)
        // console.log(req.body.count)
        // console.log(req.body.newQuantity)
        let checkQuantity = req.body.newQuantity
        // console.log("chweckquantity" + checkQuantity)
        // console.log(req.body.price)
        let productPrice = req.body.price
        console.log(req.session.username)
        let val = Number(req.body.newQuantity) + req.body.count

        // console.log("vallllllllllllllllllll" + val)
        const cartCheck = await cartData.find({ username: req.session.username, productname: req.body.productId })
        const productCheck = await productData.findOne({ productname: req.body.productId })
        console.log("-----------------------------------")
       
        console.log(productCheck)    
        console.log(productCheck.stock)
        console.log("------------------------------------------------------------------")
        console.log("the product from db" + cartCheck[0].quantity)

        let cartQuantity = cartCheck[0].quantity
        let valuecheck = cartQuantity + req.body.count
        console.log(valuecheck+"      requested price")
        if(valuecheck<=productCheck.stock ){
                if (valuecheck >= 1 & valuecheck <= 10) {

                    console.log("entered into the checkQuantity if condition")
                    const userquantity = await cartData.updateOne({ $and: [{ username: req.session.username }, { productname: req.body.productId }] }, { $inc: { quantity: req.body.count } })
                    console.log(" To check Update or not " + userquantity)
                }
        }else{
            res.json({ success: false, msg:"Stock has reach the limit" })
        }
        const cartlen = await cartData.find({ username: req.session.username, productname: req.body.productId })
        console.log(cartlen)
        quantity = cartlen[0].quantity


        const totalprice = await cartData.aggregate([
            {
                $match: { username: req.session.username }
            },
            {
                $group: { _id: "$productname", price: { $sum: "$price" }, quantity: { $sum: "$quantity" } }
            },
            {
                $project: { _id: 0, amount: { $multiply: ["$price", "$quantity"] } }
            },
            {
                $group: { _id: "null", total: { $sum: "$amount" } }
            }
        ])

        console.log(totalprice)


        if (totalprice.length < 1) {
            totalAmount = 0
        }
        else {
            console.log(totalprice[0].total)
            totalAmount = totalprice[0].total

        }


        let totalPrice = quantity * productPrice
        console.log("totalprice" + totalPrice)
        res.json({ success: true, quantity, totalPrice, totalAmount })



    }
    catch (e) {
        console.log("problem with the updateQuality" + e)
        // res.redirect("/error")
    }

}





// const updateQuantity = async (req, res) => {
//     try {
//         let quantity
//         let totalAmount

//         console.log("updatewQuantity................-------------------------------------")
//         // console.log(req.body)
//         // console.log(req.body.count)
//         // console.log(req.body.newQuantity)
//         let checkQuantity = req.body.newQuantity
//         // console.log("chweckquantity" + checkQuantity)
//         // console.log(req.body.price)
//         let productPrice = req.body.price
//         console.log(req.session.username)
//         let val = Number(req.body.newQuantity) + req.body.count

//         // console.log("vallllllllllllllllllll" + val)
//         const cartCheck = await cartData.find({ username: req.session.username, productname: req.body.productId })
//         console.log("the product from db" + cartCheck[0].quantity)

//         let cartQuantity = cartCheck[0].quantity
//         let valuecheck = cartQuantity + req.body.count
//         if (valuecheck >= 1 & valuecheck <= 10) {

//             console.log("entered into the checkQuantity if condition")
//             const userquantity = await cartData.updateOne({ $and: [{ username: req.session.username }, { productname: req.body.productId }] }, { $inc: { quantity: req.body.count } })
//             console.log(" To check Update or not " + userquantity)
//         }
//         const cartlen = await cartData.find({ username: req.session.username, productname: req.body.productId })
//         console.log(cartlen)
//         quantity = cartlen[0].quantity


//         const totalprice = await cartData.aggregate([
//             {
//                 $match: { username: req.session.username }
//             },
//             {
//                 $group: { _id: "$productname", price: { $sum: "$price" }, quantity: { $sum: "$quantity" } }
//             },
//             {
//                 $project: { _id: 0, amount: { $multiply: ["$price", "$quantity"] } }
//             },
//             {
//                 $group: { _id: "null", total: { $sum: "$amount" } }
//             }
//         ])

//         console.log(totalprice)


//         if (totalprice.length < 1) {
//             totalAmount = 0
//         }
//         else {
//             console.log(totalprice[0].total)
//             totalAmount = totalprice[0].total

//         }


//         let totalPrice = quantity * productPrice
//         console.log("totalprice" + totalPrice)
//         res.json({ success: true, quantity, totalPrice, totalAmount })



//     }
//     catch (e) {
//         console.log("problem with the updateQuality" + e)
//         res.redirect("/error")
//     }

// }


module.exports = { addToCart, cartRemoving, cartDisplay, userAuthorize, incrementData, decrementData, updateQuantity }