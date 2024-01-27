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
    }
}





//DISPLAY THE CATEGORY DETAILS FOR THE CATEGORY PAGE

const categoryDetails = async (req, res) => {

    try {


        console.log("entered into the categorydetails")
        const categoryData = await catData.find({})

        console.log(req.query.edit)
        let success=req.query.edit

         console.log(categoryData[0].list)

        // console.log(categoryData)

        // console.log(req.params.value)

        // const count=await productData.aggregate([{$group:{_id:"$category",count:{$sum:1}}}])

        res.render("adminCategory", { categoryData,success })

        // console.log(categoryData)
        // console.log(count)


    }
    catch (e) {
        console.log(e)
    }

}



//SAVE CATEGORY TO CATEGORY DATABASE

const storeCategory = async (req, res) => {
    try {

        console.log(req.body.category)
        const newCategory = new catData({

            category: req.body.category,
            list: 0

        })

        await newCategory.save()
        console.log(newCategory)

        res.redirect("/admin/category")

    }
    catch {

        console.log("The prblem with category to database")
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
    }


}



const editCategory=async(req,res)=>{

    try{
      console.log("editr category")
      console.log(req.params.catid)
  
      if(req.params.catid)
      { 
          console.log(req.body.categoryname)
         
  
          const changecat=await catData.findOne({category:req.params.catid})
          await catData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname}})
  
          // const changepro=await productData.updateMany({category:req.params.catid},{$set:{category:req.body.categoryname}})
  
          console.log(changecat)
          // console.log(changepro)
  
          res.redirect("/admin/category?edit=Successfully Edited")
      }
  
    }
    catch(e)
    {
      console.log("This is editCategory error "+e)
    }
  
  
  }


  module.exports={
    categoryDelete,
    categoryDetails,
    storeCategory,
    list,
    editCategory

  }