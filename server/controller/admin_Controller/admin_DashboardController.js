const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData = require("../../model/user_Orders")


const dashboardData = async (req, res) => {
  try {
    console.log("entered dashboarddata")
    const userCount=await userData.find({}).count()
    const productCount=await productData.find({}).count()
    const orderCount=await orderData.find({}).count()
    const orderCategorydata = await orderData.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(orderCategorydata)



    const categoryData = await catData.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalSales = await orderData.aggregate([
      {
        $group: {
          _id: "null",
          count: { $sum: "$price" }
        }
      }
    ]);


    console.log(totalSales)
    
    
    res.render("adminPanel",{userCount,productCount,orderCount,orderCategorydata,categoryData,totalSales})


  }
  catch (e) {
    console.log("problem withe the dashboardDisplay" + e)
  }
}




const dashboardDisplay = async (req, res) => {


  try {


    const monthAggregation = await orderData.aggregate([
      {
        $match: {
          orderdate: { $exists: true } // Optional: filter documents with the date field
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderdate" },
            month: { $month: "$orderdate" },
            // day: { $dayOfMonth: "$orderdate" }
          },
          count: { $sum: 1 },
          // Add other aggregations or fields as needed
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          //"_id.day": 1
        }
      }
    ])
    console.log(
      monthAggregation
    )

    res.json(monthAggregation)



  }
  catch (e) {

  }

}

module.exports = { dashboardDisplay, dashboardData }