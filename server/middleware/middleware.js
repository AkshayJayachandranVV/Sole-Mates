

const userAuthorizeCheck = async (req, res, next) => {

    try {
        if (req.session.authenticated) {
            console.log("userAuthorizeCheck"+req.session.authenticated)
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



const adminAuthorizeCheck = async (req, res,next) => {
    try {

        const val = req.query.pass
        const name = req.query.name

        console.log("admin entered ---------------------------------------------")
        console.log(req.session.auth)

        if (req.session.auth) {
            next()
        }
        else {
            console.log("else works")
            res.redirect("/admin")

            // res.render("adminLogin", { val, name })
        }

    }
    catch (e) {

        console.log("problem with the adminAuthorizeCheck" + e)

    }
}



module.exports = { userAuthorizeCheck,adminAuthorizeCheck }