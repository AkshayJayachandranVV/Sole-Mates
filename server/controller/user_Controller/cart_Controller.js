const user = require("../../model/user_register")

const productData = require("../../model/product_details")


const cartData=require("../../model/user_cart")





//MIDDLEWARE TO CHECK THE USER LOGIN TO GIVE AUTHORIZATION

const userAuthorize=async(req,res,next)=>{

    try{

        if(req.session.authenticated)
        {

            // const displayCart= await cartData.find({username:req.session.username})           
    
            // res.render("addToCart",{displayCart})

            next()
             
      
        }
        else{
            res.redirect("/userLogin")
        }

    }
    catch(e)
    {
        console.log(e)
    }
}

// ADD TO CART

const addToCart=async(req,res)=>{

    try{

        console.log("helooo to add to art")

        if(req.params.prodname)
        {

            console.log(req.params.prodname)
            console.log(req.session.username)

            const addCart= await productData.findOne({productname:req.params.prodname})
        
    
            console.log(addCart.productname)
            console.log(addCart.category)
            console.log(addCart.imagepath[0])
            console.log(req.session.username)
           
            // imagePath[1] = addCart.imagepath[1].path
            // imagePath[2] = addCart.imagepath[2].path
            // imagePath[3] = addCart.imagepath[3].path
           
            const userdata=req.session.username

            const newCart=new cartData({

                imagepath: addCart.imagepath[0],
                productname:addCart.productname,
                price:addCart.price,
                removevalue:0,
                username:req.session.username,
                quantity:1


            })
            await newCart.save()

            console.log("cart added succesfully")
 
            const displayCart= await cartData.find({username:req.session.username})           
    
            res.redirect("/cart")

        }



    }
    catch(e){
   
    console.log("error in the addToCart part" + e)

    }
}



const cartDisplay=async(req,res)=>{


    try{
        console.log("entere the cartdisplay")
        console.log(req.session.username)
        const displayCart= await cartData.find({username:req.session.username}) 
         
        const totalprice=await cartData.aggregate([
            {
                $match:{username:req.session.username}
            },
            {
                $group:{_id:"$productname",price:{$sum:"$price"},quantity:{$sum:"$quantity"}}
            },
            {
                $project:{_id:0,amount:{$multiply:["$price","$quantity"]}}
            },
            {
                $group:{_id:"null",total:{$sum:"$amount"}}
            }
        ])
        console.log("after the total price")
        console.log(totalprice)
        let totalAmount

        if(totalprice.length<1)
        {
            totalAmount=0
        }
        else{
            console.log(totalprice[0].total)
            totalAmount=totalprice[0].total

        }
   
       

        // console.log(displayCart.quantity)   
        console.log(displayCart)    
        const cartlen=await cartData.find({username:req.session.username}).countDocuments()
        console.log(cartlen)   
    
        res.render("addToCart",{displayCart,cartlen,totalAmount})

    }
    catch(e){
        console.log("The error with cartDisplay"+e)

    }
}



const cartRemoving=async(req,res)=>{
  
    try{

        console.log(req.params.proId)

        if(req.params.proId)
        {
            console.log("entered into the cart rmoval")
            const deleteData=await cartData.deleteOne({username: req.session.username },{productname:req.params.proId})

            //i have changed gere i added to find the product withe username in the session to delete the cart of the particular user
            // const deleteDt=await cartData.findOne({productname:req.params.proId})
            console.log(deleteData)
        }

      


        res.redirect("/cart")
        // res.render("addToCart",{displayCart})

    }
    catch(e)
    {
        console.log("the error is present in cartRemoving")
    }



}



const incrementData=async(req,res)=>{
    try{
      console.log("incrment data")

     console.log("hyyy to increment")
     
     
      const userquantity=await cartData.updateOne({$and:[{username:req.session.username},{productname:req.params.proId}]},{$inc:{quantity:1}})


    //   const cartValue=await cartData.findOne({$and:[{username:req.session.username},{productname:req.params.proId}]})
    //   console.log(cartValue.price)
    //   console.log(cartValue.quantity)

      console.log(userquantity)

      res.redirect("/cart")

    }
    catch(e)
    {
        console.log("Problem with the incrementData"+e)
    }
}




const decrementData=async(req,res)=>{
    try{
        console.log("hyyy to decrement")


     
      const userquantity=await cartData.updateOne({$and:[{username:req.session.username},{productname:req.params.proId}]},{$inc:{quantity:-1}})
      console.log(userquantity)

      res.redirect("/cart")

    }
    catch(e)
    {
        console.log("Problem with the incrementData"+e)
    }
}

module.exports={addToCart,cartRemoving,cartDisplay,userAuthorize,incrementData,decrementData}