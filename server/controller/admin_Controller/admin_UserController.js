const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData=require("../../model/user_Orders")



//SHOW THE USER DATA IN ADMINPANEL

const showUser = async (req, res) => {

    try {


        let currentValue=req.query.page || 0

        if(req.query.next){
            currentValue++

        }

        if(req.query.previous){
            currentValue--

        }

        const userList=await userData.find({}).skip(currentValue*6).limit(6).sort({_id:-1})

        // const value = await userData.find({}).sort({_id:-1})

        // console.log(value)

        res.render("adminUsers",{userList,currentValue})

    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")

    }
}

// ADMIN SEARCH FOR SPECIFIC USER

const searchUser = async (req, res) => {

    try {

        console.log("search user try entered")
        if (req.body.filter) {

            const filterUser = req.body.filter

            const regex = new RegExp(`^${filterUser}`, 'i')

            const value = await userData.find({ username: { $regex: regex } })



            res.render("adminUsers", { value, filterUser })
        }
        else {
            res.redirect("/admin/users")

        }

    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }
}


//BLOCK AND UN BLOCK THE USER 

const blockUser = async (req, res) => {

    try {
        if (req.params.username) {
            console.log("entered the blockuser")
            const emailValue = req.params.username
            console.log(req.params.username)
            const user = await userData.findOne({ username: emailValue })

            let val = 1

            if (user.status) {
                val = 0


            }


            const blockData = await userData.updateOne({ username: emailValue }, { $set: { status: val } })
            res.redirect("/admin/users")

        }

    }
    catch (e) {

        console.log(e)
        res.redirect("/admin/error")

    }
}


module.exports={
    showUser,
    searchUser,
    blockUser 

}