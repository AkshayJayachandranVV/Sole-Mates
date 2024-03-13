const productData = require("../../model/product_details")

const wishlistData=require("../../model/user_wishlist")


// DISPLAY THE WISHLIST

const displayWishlist=async(req,res)=>{

    try{
        console.log("hyy")

        const displayCart= await wishlistData.find({username:req.session.username})   

        res.render("userWishlist",{displayCart})
  
    }
    catch(e)
    {
      console.log("error with the displayWishlist" + e)
      res.redirect("/error")
    }
  

  }



const addWishlist=async(req,res)=>{
   
    try{
        console.log("req.session.authenticated")
        console.log(req.session.authenticated)
        if (!req.session.authenticated) {
            let noEntry="not entry"
            return res.json({ success: true,noEntry})
        }
        console.log(req.body.productId + "55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555")

        const proD=await productData.findOne({productname:req.body.productId})

        const presentList=await wishlistData.findOne({username:req.session.username,productname:req.body.productId})

        if(presentList){
            return res.json({ success: true,presentList})
        }
        console.log(proD.imagepath[0])

        console.log(req.session.username)

        const newWish=new wishlistData({

         productname:proD.productname,
         imagepath:proD.imagepath[0],
         price:proD.price,
         offerprice:proD.offerprice,
         username:req.session.username
 
        })

        await newWish.save()

        console.log("cart added succesfully")

        let valid="true"

        return res.json({ success: true,valid})

        // const displayCart= await wishlistData.find({username:req.session.username})  
        
        // res.redirect("/wishlist")

        // res.render("userWishlist",{displayCart})

    }
    catch(e)
    {
        console.log("problem with addWishlist"+e)
        res.redirect("/error")
    }


}

const deleteWishlist=async(req,res)=>{

 try{

    console.log(req.params.wishId)


    if(req.params.wishId)
        {
            console.log("entered into the wishlist rmoval")
            const deleteData=await wishlistData.deleteOne({username: req.session.username },{productname:req.params.proId})

            //i have changed gere i added to find the product withe username in the session to delete the cart of the particular user
            // const deleteDt=await cartData.findOne({productname:req.params.proId})
            console.log(deleteData)
        }
   res.redirect("/wishlist")
 }
 catch(e)
 {
    console.log("problem with the deleteWishlist"+e)
    res.redirect("/error")
 }




}


module.exports={addWishlist,displayWishlist,deleteWishlist}