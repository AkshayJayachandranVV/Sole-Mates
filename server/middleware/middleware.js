

const userAuthorizeCheck = async (req, res, next) => {

    try {
        if (req.session.authenticated) {
            next()
        }
        else {
            res.redirect("/userLogin")
        }
    }
    catch (e) {
        console.log("the error with  authorize cehck" + e)
    }

}



const adminAuthorizeCheck = async (req, res) => {
    try {

        const val = req.query.pass
        const name = req.query.name

        console.log("admin entered")

        if (req.session.auth) {
            res.render("adminPanel")
        }
        else {
            res.render("adminLogin", { val, name })
        }

    }
    catch (e) {

        console.log("problem with the adminAuthorizeCheck" + e)

    }
}



module.exports = { userAuthorizeCheck,adminAuthorizeCheck }