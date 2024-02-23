const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData=require("../../model/user_Orders")



const categoryDelete = async (req, res) => {
    try {

        if (req.params.catId) {
            console.log(req.params.catId)

            const catDel = await catData.deleteOne({ category: req.params.catId })
        }
        res.redirect("/admin/category")

    }
    catch (e) {
        console.log("this is the mistake of the categort delete" + e)
        res.redirect("/admin/error")
    }
}





//DISPLAY THE CATEGORY DETAILS FOR THE CATEGORY PAGE

const categoryDetails = async (req, res) => {

    try {
          console.log(req.query.alreadycat)
          let categoryPresented=req.query.alreadycat

        console.log("entered into the categorydetails")
        const categoryData = await catData.find({}).sort({_id:-1})

        console.log(req.query.edit)
        let success=req.query.edit

         console.log(categoryData[0].list)

        // console.log(categoryData)

        // console.log(req.params.value)

        // const count=await productData.aggregate([{$group:{_id:"$category",count:{$sum:1}}}])

        res.render("adminCategory", { categoryData,success,categoryPresented })

        // console.log(categoryData)
        // console.log(count)


    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }

}



//SAVE CATEGORY TO CATEGORY DATABASE

const storeCategory = async (req, res) => {
    try {

        console.log("entered int o the storeCategory")

        console.log(req.body.categoryname)
        console.log(req.body)

        const filter=req.body.categoryname
        const regex = new RegExp(`^${filter}`, 'i')

        const Alreadycategory=await catData.find({category:{$regex:regex}})

        console.log(Alreadycategory.length+ "lengthhhhhhhhhhhhhhhhhhhhhhhhh")
        if(Alreadycategory.length>0){
            res.redirect("/admin/category?alreadycat=Category Already Present")

        }else{
        const newCategory = new catData({

            category: req.body.categoryname,
            offer:req.body['offer-percentage'],
            list: 0

        })
        await newCategory.save()
        console.log(newCategory)

 
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    

        res.redirect("/admin/category")
    }

    }
    catch {

        console.log("The prblem with category to database")
        res.redirect("/admin/error")
    }
}




// LIST AND UNLIST THE COLLECTIONS

const list = async (req, res) => {



    try {
        console.log("list try entered")

        console.log(req.params.category)

        const data = await catData.find({ category: req.params.category })

        let val = 1;

        console.log(data[0].list)

        if (data[0].list == 1) {

            val = 0

        }

        const list = await productData.updateMany({ category: req.params.category }, { $set: { list: val } })
        const list2 = await catData.updateMany({ category: req.params.category }, { $set: { list: val } })

        res.redirect("/admin/category")

    }
    catch (e) {
        console.log(e)
        res.redirect("/admin/error")
    }


}



const editCategory=async(req,res)=>{

    try{
      console.log("editr category")
      console.log(req.params.catid)

      await catData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname, offer:req.body['offer-percentage']}})
  
      if(req.params.catid)
      { 
          console.log(req.params.catid)

//-------------------------------------------------------------------
          console.log("entered into the aplly category")
        //   console.log(req.params.category)
                
          const categoryOffer=await catData.findOne({category:req.params.catid})
          console.log(categoryOffer.applied + "33333333333")
  
          if(!categoryOffer.applied){
              console.log("enreed into the if of the categoryOffer")
            //   const product=await productData.find({category:req.params.catid})
            //   console.log(product)
            //   for(let i=0;i<product.length;i++){
            //   await productData.updateOne({productname:product[i].productname},{$set:{offerprice:product[i].price}})
            //   }
            //   await catData.updateOne({category:req.params.catid},{$set:{applied:0}})
            // await catData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname, offer:req.body['offer-percentage']}})

  
              res.redirect("/admin/category?edit=Successfully Edited")
          }else{
              console.log("enreed into the else of the categoryOffer")
          const product=await productData.find({category:req.params.catid})
          console.log(product)
            for(let i=0;i<product.length;i++){
                let offer
                if(product[i].offer>=categoryOffer.offer){
                    offer=product[i].offer
                }else{
                    offer=categoryOffer.offer 
                }
                console.log(product[i].offer   + "  product    oferererererererere")
                console.log(categoryOffer.offer    + " category   oferererererererere")
                console.log(offer   + "   oferererererererere")
                let OfferPrice =Math.floor(product[i].price - (product[i].price * (offer/ 100))) 
                console.log(product[i].price + " og price")
                console.log(OfferPrice)
                await productData.updateOne({productname:product[i].productname},{$set:{offerprice:OfferPrice}})
               
            }
            // await catData.updateOne({category:req.params.category},{$set:{applied:1}})

            // await catData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname, offer:req.body['offer-percentage']}})

            
            res.redirect("/admin/category?edit=Successfully Applied")
         
          }



//-------------------------------------------------------------------
          
         
  
        //   const changecat=await catData.findOne({category:req.params.catid})
        //   console.log(changecat)
        //   if(changecat)
        //   {
            //    res.redirect("/admin/category?alreadycat=Category Already Present")
        //   }else{
            //    await catData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname, offer:req.body['offer-percentage']}})

        //   }
         
  
          // const changepro=await productData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname}})
  
        //   console.log(changecat+ "7777777777777777" )
          


        //   res.redirect("/admin/category?edit=Successfully Edited")
      }
  
    }
    catch(e)
    {
      console.log("This is editCategory error "+e)
      res.redirect("/admin/error")
    }
  
  
  }


  const applyCategoryOffer=async(req,res)=>{
    try{

        console.log("entered into the aplly category")
        console.log(req.params.category)
              
        const categoryOffer=await catData.findOne({category:req.params.category})
        console.log(categoryOffer.applied + "33333333333")

        if(categoryOffer.applied){
            console.log("enreed into the if of the categoryOffer")
            const product=await productData.find({category:req.params.category})
            console.log(product)
            for(let i=0;i<product.length;i++){
                 let offer
                if(product[i].offer){
                    let OfferPrice =Math.floor(product[i].price - (product[i].price * (product[i].offer/ 100))) 
                    console.log(product[i].price + " og price")
                    console.log(OfferPrice)
                    offer=OfferPrice
                }else{
                    offer=product[i].price
                }
            await productData.updateOne({productname:product[i].productname},{$set:{offerprice:offer}})
            }
            await catData.updateOne({category:req.params.category},{$set:{applied:0}})

            res.redirect("/admin/category?edit=Successfully Removed")
        }else{
            console.log("enreed into the else of the categoryOffer")
        const product=await productData.find({category:req.params.category})
        console.log(product)
          for(let i=0;i<product.length;i++){
              let offer
              if(product[i].offer>=categoryOffer.offer){
                  offer=product[i].offer
              }else{
                  offer=categoryOffer.offer 
              }
              let OfferPrice =Math.floor(product[i].price - (product[i].price * (offer/ 100))) 
              console.log(OfferPrice)
              await productData.updateOne({productname:product[i].productname},{$set:{offerprice:OfferPrice}})
             
          }
          await catData.updateOne({category:req.params.category},{$set:{applied:1}})
          
          res.redirect("/admin/category?edit=Successfully Applied")
       
        }

          

    }catch(e){
        console.log("problem with the applyCategoryOffer"+e)
        res.redirect("/admin/error")
    }
  }





  module.exports={
    categoryDelete,
    categoryDetails,
    storeCategory,
    list,
    editCategory,
    applyCategoryOffer,
    

  }