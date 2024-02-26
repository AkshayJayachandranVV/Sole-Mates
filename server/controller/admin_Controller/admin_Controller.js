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


    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
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

        }

        res.render("adminLogin")

    }
    catch (e) {

        console.log(e)
        res.redirect("/admin/error")

    }
}



module.exports = {
    Login,
    signout,
    displayPanel
}