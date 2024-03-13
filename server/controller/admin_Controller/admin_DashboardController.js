const userData = require("../../model/user_register")
const { use } = require("../../routes/user_route")
const bcrypt = require("bcrypt")
const productData = require("../../model/product_details")
const catData = require("../../model/category_Model")
const orderData = require("../../model/user_Orders")
const fs = require("fs");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");

const dashboardData = async (req, res) => {
  try {
    console.log("entered dashboarddata")
    const userCount = await userData.find({}).count()
    const productCount = await productData.find({}).count()
    const orderCount = await orderData.find({}).count()
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


    res.render("adminPanel", { userCount, productCount, orderCount, orderCategorydata, categoryData, totalSales })


  }
  catch (e) {
    console.log("problem withe the dashboardDisplay" + e)

    res.redirect("/admin/error")
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
            day: { $dayOfMonth: "$orderdate" }
          },
          count: { $sum: 1 },
          // Add other aggregations or fields as needed
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ])
    console.log(
      monthAggregation
    )


    res.json(monthAggregation)



  }
  catch (e) {

    console.log("problem wieth the dashboardDisplay" + e)
    res.redirect("/admin/error")

  }

}


const salesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    console.log(req.body);


    const totalRevenew = await orderData.aggregate([
      {
        $match: {
          orderdate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          }
        },
      },
      {
        $group: {
          _id: "null",
          totalMoney: { $sum: "$price" }
        }
      }
    ]);

    let revenue = 0; // Default revenue value

    if (totalRevenew.length > 0 && totalRevenew[0].totalMoney !== undefined) {
      revenue = totalRevenew[0].totalMoney;
    }

    console.log(revenue);



    const category = await orderData.aggregate([
      {
        $match: {
          orderdate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },


      {
        $group: {
          _id: "$productname",
          totalOrders: { $sum: 1 }
        }
      }
    ]);
    console.log(category);

    const status = await orderData.aggregate([
      {
        $match: {
          orderdate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          }
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);



    const onlineData = await orderData.aggregate([
      {
        $match: {
          orderdate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          cod: 0 // Include the cod condition here
        }
      },
      {
        $group: {
          _id: null,
          totalMoney: { $sum: "$price" }
        }
      }
    ]);




    const codData = await orderData.aggregate([
      {
        $match: {
          orderdate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          cod: 1 // Include the cod condition here
        }
      },
      {
        $group: {
          _id: null,
          totalMoney: { $sum: "$price" }
        }
      }
    ]);


    let onlineValue = 0;
    let codValue = 0;
    
    if (onlineData && onlineData[0] && onlineData[0].totalMoney !== undefined) {
      onlineValue = onlineData[0].totalMoney;
    }else{
      onlineValue=0
    }
    
    if (codData && codData[0] && codData[0].totalMoney !== undefined) {
      codValue = codData[0].totalMoney;
    }else{
      codValue=0
    }
    
    console.log("Online Value: ", onlineValue);
    console.log("COD Value: ", codValue);
    


    const orderCount = await orderData.aggregate([
      {
        $match: {
          orderdate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 } // Count the documents
        }
      }
    ]);


let totalCount = 0;

if (orderCount && orderCount[0] && orderCount[0].totalCount !== undefined) {
  totalCount = orderCount[0].totalCount;
}else{
  totalCount=0
}

console.log("Total Count: ", totalCount);






    const htmlContent = `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Sales Report</title>
                  <style>
                      body {
                          margin-left: 20px;
                      }
                  </style>
              </head>
              <body>
                  <h2 align="center"> Sales Report</h2>
                  Start Date: ${startDate}<br>
                  End Date: ${endDate}<br> 
                  <h3>Total Revenue:${revenue}</h3>
                  <h3>Total Sales(COD):${codValue}</h3>
                  <h3>Total Sales(Online):${onlineValue}</h3>

                  <center>
                  <h3>Total Sales</h3>
                  
                      <table style="border-collapse: collapse;">
                          <thead>
                              <tr>
                                  <th style="border: 1px solid #000; padding: 8px;">Sl N0</th>
                                  <th style="border: 1px solid #000; padding: 8px;">Product</th>
                                  <th style="border: 1px solid #000; padding: 8px;">Total Orders</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${category
        .map(
          (item, index) => `
                                  <tr>
                                      <td style="border: 1px solid #000; padding: 8px;">${index + 1
            }</td>
                                      <td style="border: 1px solid #000; padding: 8px;">${item._id
            }</td>
                                      <td style="border: 1px solid #000; padding: 8px;">${item.totalOrders
            }</td>
                                  </tr>`
        )
      }
                                  
                          </tbody>
                      </table>
                  </center>
                  <center>
                  <h3>Order Status</h3>
                      <table style="border-collapse: collapse;">
                          <thead>
                              <tr>
                                  <th style="border: 1px solid #000; padding: 8px;">Sl N0</th>
                                  <th style="border: 1px solid #000; padding: 8px;">Status</th>
                                  <th style="border: 1px solid #000; padding: 8px;">Total Count</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${status
        .map(
          (item, index) => `
                                  <tr>
                                      <td style="border: 1px solid #000; padding: 8px;">${index + 1
            }</td>
                                      <td style="border: 1px solid #000; padding: 8px;">${item._id
            }</td>
                                      <td style="border: 1px solid #000; padding: 8px;">${item.count
            }</td>
                                  </tr>`
        )
      }
                                  
                          </tbody>
                      </table>
                  </center>
                  <h3>Total Orders:${totalCount}</h3>
                  
              </body>
              </html>
          `;

    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser'
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);


    const pdfBuffer = await page.pdf();

    await browser.close();

    // const downloadsPath = path.join(os.homedir(), "Downloads");
    // const pdfFilePath = path.join(downloadsPath, "sales.pdf");


    // fs.writeFileSync(pdfFilePath, pdfBuffer);

    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sales.pdf");
    res.status(200).end(pdfBuffer);
  } catch (err) {
    console.log(err);
    res.redirect('/admin/error')
  }
}




module.exports = { dashboardDisplay, dashboardData, salesReport }