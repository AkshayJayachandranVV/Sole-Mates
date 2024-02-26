const user = require("../../model/user_register")
const productData = require("../../model/product_details")
const categoryData = require("../../model/category_Model")
const addressData = require("../../model/user_address")
const cartData = require("../../model/user_cart")
const orderData = require("../../model/user_Orders")
const CouponData = require("../../model/coupon_Model")

const mongoose = require("mongoose")

const displayCheckout = async (req, res) => {


  try {
    console.log("displayCkeout")

    // let userAddressData=req.session.userAddress
    const userAdd = await addressData.find({ email: req.session.email })
    console.log(userAdd)
    res.render("checkout", { userAdd })

  }
  catch (e) {
    console.log("Error with the displayCheckout" + e)
    res.redirect("/error")
  }


}


const displayOrder = async (req, res) => {

  try {

    console.log(req.query.invalid)


    let msg = req.query.invalid


    // Object.size = function (obj) {
    //   var size = 0,
    //     key;
    //   for (key in obj) {
    //     if (obj.hasOwnProperty(key)) size++;
    //   }
    //   return size;
    // };
    console.log("log into the display order")
    // if (Object.size(req.body) == 0) {
    //   console.log("not req.body")
    //   // console.log(req.body)
    //   const userAdd = await addressData.findOne({ email: req.session.email })
    //   req.session.userAddress = userAdd


    // }
    // else {
    //   console.log("req.body")
    //   console.log(req.body)
    //   req.session.userAddress = req.body

    // }

    console.log(req.body)

    let address = req.body





    req.session.userAddress = req.body

    console.log(req.session.userAddress)

    const cart = await cartData.find({ username: req.session.username })

    const totalprice = await cartData.aggregate([
      {
        $match: { username: req.session.username }
      },
      {
        $group: { _id: "$productname", price: { $sum: "$price" }, quantity: { $sum: "$quantity" } }
      },
      {
        $project: { _id: 0, amount: { $multiply: ["$price", "$quantity"] } }
      },
      {
        $group: { _id: "null", total: { $sum: "$amount" } }
      }
    ])


    console.log(totalprice)
    let totalValue = totalprice[0].total
    console.log(totalValue)

    console.log(totalprice)

    const User = req.session.username

    const wallet = await user.findOne({ username: User })
    let walletAmount = wallet.wallet
    if(!walletAmount){
      walletAmount=0
    }

    res.render("userPayment", { cart, totalValue, User, address, msg, walletAmount })

  }
  catch (e) {
    console.log("problem with displayOrder" + e)
    res.redirect("/error")
  }


}

const otpGenerator = require("otp-generator");

const orderId = () => {
  const OTP = otpGenerator.generate(16, {
    upperCaseAlphabets: true,
    digits: false,
    lowerCaseAlphabets: true,
    specialChars: false,
  });
  const timestamp = Date.now();
  return { OTP, timestamp };
  // return OTP;
};






// const cashOnDelivery = async (req, res) => {

//   try {

//     let otpValue = orderId()
//     console.log(otpValue)
//     let otp = otpValue.OTP
//     let date = otpValue.timestamp

//     console.log("cashOnDelivery")

//     const cartProduct = await cartData.find({ username: req.session.username });
//     //const userData=await user.find({email:req.session.email});
//     //  const addressD=await addressData.find({email:req.session.email})
//     // console.log(cartData)
//     // console.log(userData)
//     // console.log(address)

//     console.log("checking the useraddress in the session")
//     console.log(req.session.userAddress)


//     console.log(cartProduct.length)
//     // console.log(addressD)
//     // console.log(addressD[0].address.pincode)

//     if (req.session.userAddress.newaddress) {
//       console.log(req.session.userAddress.fullname)
//       console.log(req.session.userAddress)
//       const newAdd = new addressData({

//         fullname: req.session.userAddress.fullname,
//         phonenumber: req.session.userAddress.phone,
//         address: {
//           pincode: req.session.userAddress.pincode,
//           housename: req.session.userAddress.housename,
//           state: req.session.userAddress.state,
//           city: req.session.userAddress.city,
//           // district:req.session.userAddress.district,
//           country: req.session.userAddress.country

//         },
//         primary: 0,



//       })


//       await newAdd.save();

//     }


//       for (let i = 0; i < cartProduct.length; i++) {
//         console.log("enteredc into the forloop")
//         console.log(cartProduct)
//         console.log(cartProduct[i].quantity)
//         console.log(cartProduct[i].productname)
//         const newOrder = new orderData({
//           username: req.session.username,
//           quantity: cartProduct[i].quantity,
//           productname: cartProduct[i].productname,
//           price: cartProduct[i].price,
//           orderdate: date,
//           image: cartProduct[i].imagepath,
//           orderId: otpValue.OTP,
//           address: {
//             pincode: req.session.userAddress.pincode,
//             state: req.session.userAddress.state,
//             city: req.session.userAddress.city,
//             housename: req.session.userAddress.housename,
//             district: req.session.userAddress.district,
//             country: req.session.userAddress.country,

//           },
//           status: "ORDER PLACED",
//           cancel: 0,
//           category: cartProduct[i].category,
//           cod:0
//         })
//         await newOrder.save();

//       }


//     const order = await orderData.find({ orderId: otp })
//     console.log(order)
//     req.session.couponId = null

//     console.log(req.session.username)

//     console.log("before delete the cart")


//     const deleteCartData = await cartData.deleteMany({ username: req.session.username })

//     console.log(deleteCartData)


//     // console.log(cartProduct[0].productname)
//     // console.log(cartProduct[0].price)
//     res.render("userOrders", { order, success: "Order Placed Successfull" })

//   }
//   catch (e) {
//     console.log("problem withe the cashOnDekivery" + e)
//     res.redirect("/error")
//   }



// }








const cashOnDelivery = async (req, res) => {

  try {

    let otpValue = orderId()
    console.log(otpValue)
    let otp = otpValue.OTP
    let date = otpValue.timestamp

    console.log("cashOnDelivery")

    const cartProduct = await cartData.find({ username: req.session.username });
    //const userData=await user.find({email:req.session.email});
    //  const addressD=await addressData.find({email:req.session.email})
    // console.log(cartData)
    // console.log(userData)
    // console.log(address)

    console.log(" start code for coupon and wallet--------------------------------------------------------------------------------------------------------------")
    console.log(req.session.couponId)

    const totalprice = await cartData.aggregate([
      {
        $match: { username: req.session.username }
      },
      {
        $group: { _id: "$productname", price: { $sum: "$price" }, quantity: { $sum: "$quantity" } }
      },
      {
        $project: { _id: 0, amount: { $multiply: ["$price", "$quantity"] } }
      },
      {
        $group: { _id: "null", total: { $sum: "$amount" } }
      }
    ])

    // console.log(totalprice)

    console.log(totalprice[0].total + " total cart amount found")




    const checkCoupon = await CouponData.findOne({ couponId: req.session.couponId })
    console.log(totalprice[0].total + " value money")
    let couponAmount
    let amount
    if (checkCoupon) {
      console.log('coupon applied for this products')
      couponAmount = totalprice[0].total - checkCoupon.amount
      console.log(couponAmount)
      amount = couponAmount
      console.log(amount + "apply coupon amount")


    } else {
      console.log('coupon not applied for this product')
      // couponAmount = req.body.price
      // console.log(couponAmount)
      amount = totalprice[0].total 
      console.log(amount + "without apply coupon")

    }

    console.log(amount + " amount after applying coupon")

    console.log(req.session.walletOrder)

    if (req.session.walletOrder) {
      const ogwallet = await user.findOne({ email: req.session.email })
      ///////////////////////////////////////////////////////////code for the wallet update
      let wallet = ogwallet.wallet - amount;
      if (wallet < 0) {
        wallet = 0;
      }
      console.log(wallet + " wallet amount of the order")
      await user.updateOne({ username: req.session.username }, { $set: { wallet: wallet} });
      /////////////////////////////////////////////////////////////////////////
      console.log("wallet presented =====")
     
      console.log(ogwallet.wallet)
      amount = amount - ogwallet.wallet
          if (amount < 1) {
            amount = 1
          }


      // amount=amount-req.session.walletOrder

    } else {
      console.log("wallet  NOTTTTTT  presented =====")
      amount = amount

    }
// i removed *100 check og code------------------------------

    console.log(amount + " amount after applying wallet")


    console.log(" end code for coupon and wallet--------------------------------------------------------------------------------------------------------------")



    console.log("checking the useraddress in the session")
    console.log(req.session.userAddress)


    console.log(cartProduct.length)
    // console.log(addressD)
    // console.log(addressD[0].address.pincode)

    if (req.session.userAddress.newaddress) {
      console.log(req.session.userAddress.fullname)
      console.log(req.session.userAddress)
      const newAdd = new addressData({

        fullname: req.session.userAddress.fullname,
        phonenumber: req.session.userAddress.phone,
        address: {
          pincode: req.session.userAddress.pincode,
          housename: req.session.userAddress.housename,
          state: req.session.userAddress.state,
          city: req.session.userAddress.city,
          // district:req.session.userAddress.district,
          country: req.session.userAddress.country

        },
        primary: 0,



      })


      await newAdd.save();

    }

    console.log(req.session.razorpay + " checking the razorpay session")
    if (req.session.razorpay) {

      console.log("enetered into the condition to razorpay payment")

      for (let i = 0; i < cartProduct.length; i++) {
        console.log("enteredc into the forloop")
        console.log(cartProduct)
        console.log(cartProduct[i].quantity)
        console.log(cartProduct[i].productname)
        const newOrder = new orderData({
          username: req.session.username,
          quantity: cartProduct[i].quantity,
          productname: cartProduct[i].productname,
          price: cartProduct[i].price,
          orderdate: date,
          image: cartProduct[i].imagepath,
          orderId: otpValue.OTP,
          address: {
            pincode: req.session.userAddress.pincode,
            state: req.session.userAddress.state,
            city: req.session.userAddress.city,
            housename: req.session.userAddress.housename,
            district: req.session.userAddress.district,
            country: req.session.userAddress.country,

          },
          status: "ORDER PLACED",
          cancel: 0,
          category: cartProduct[i].category,
          cod: 0,
          totalAmount: amount
        })
        await newOrder.save();

        const updateStock=await productData.updateOne({productname:cartProduct[i].productname},{$inc:{stock:-cartProduct[i].quantity}})
        console.log(updateStock)

      }
      req.session.razorpay = null
      console.log(req.session.razorpay + "after razorpay online payment")

    }
    else {

      console.log("enetered into the condition to cod payment")

      for (let i = 0; i < cartProduct.length; i++) {
        console.log("enteredc into the forloop")
        console.log(cartProduct)
        console.log(cartProduct[i].quantity)
        console.log(cartProduct[i].productname)
        const newOrder = new orderData({
          username: req.session.username,
          quantity: cartProduct[i].quantity,
          productname: cartProduct[i].productname,
          price: cartProduct[i].price,
          orderdate: date,
          image: cartProduct[i].imagepath,
          orderId: otpValue.OTP,
          address: {
            pincode: req.session.userAddress.pincode,
            state: req.session.userAddress.state,
            city: req.session.userAddress.city,
            housename: req.session.userAddress.housename,
            district: req.session.userAddress.district,
            country: req.session.userAddress.country,

          },
          status: "ORDER PLACED",
          cancel: 0,
          category: cartProduct[i].category,
          cod: 1,
          totalAmount: amount
        })
        await newOrder.save();

        const updateStock=await productData.updateOne({productname:cartProduct[i].productname},{$inc:{stock:-cartProduct[i].quantity}})
        console.log(updateStock)

      }
    }

    const order = await orderData.find({ orderId: otp })
    console.log(order)
    req.session.couponId = null

    console.log(req.session.username)

    console.log("before delete the cart")


    const deleteCartData = await cartData.deleteMany({ username: req.session.username })

    console.log(deleteCartData)


    // console.log(cartProduct[0].productname)
    // console.log(cartProduct[0].price)
    res.render("userOrders", { order, success: "Order Placed Successfull" })

  }
  catch (e) {
    console.log("problem withe the cashOnDekivery" + e)
    res.redirect("/error")
  }



}














// const cashOnDelivery = async (req, res) => {

//   try {

//     let otpValue = orderId()
//     console.log(otpValue)
//     let otp = otpValue.OTP
//     let date = otpValue.timestamp

//     console.log("cashOnDelivery")

//     const cartProduct = await cartData.find({ username: req.session.username });
//     //const userData=await user.find({email:req.session.email});
//     //  const addressD=await addressData.find({email:req.session.email})
//     // console.log(cartData)
//     // console.log(userData)
//     // console.log(address)







//     console.log("checking the useraddress in the session")
//     console.log(req.session.userAddress)


//     console.log(cartProduct.length)
//     // console.log(addressD)
//     // console.log(addressD[0].address.pincode)

//     if (req.session.userAddress.newaddress) {
//       console.log(req.session.userAddress.fullname)
//       console.log(req.session.userAddress)
//       const newAdd = new addressData({

//         fullname: req.session.userAddress.fullname,
//         phonenumber: req.session.userAddress.phone,
//         address: {
//           pincode: req.session.userAddress.pincode,
//           housename: req.session.userAddress.housename,
//           state: req.session.userAddress.state,
//           city: req.session.userAddress.city,
//           // district:req.session.userAddress.district,
//           country: req.session.userAddress.country

//         },
//         primary: 0,



//       })


//       await newAdd.save();

//     }

//     console.log(req.session.razorpay +" checking the razorpay session")
//     if (req.session.razorpay) {

//       console.log("enetered into the condition to razorpay payment")

//       for (let i = 0; i < cartProduct.length; i++) {
//         console.log("enteredc into the forloop")
//         console.log(cartProduct)
//         console.log(cartProduct[i].quantity)
//         console.log(cartProduct[i].productname)
//         const newOrder = new orderData({
//           username: req.session.username,
//           quantity: cartProduct[i].quantity,
//           productname: cartProduct[i].productname,
//           price: cartProduct[i].price,
//           orderdate: date,
//           image: cartProduct[i].imagepath,
//           orderId: otpValue.OTP,
//           address: {
//             pincode: req.session.userAddress.pincode,
//             state: req.session.userAddress.state,
//             city: req.session.userAddress.city,
//             housename: req.session.userAddress.housename,
//             district: req.session.userAddress.district,
//             country: req.session.userAddress.country,

//           },
//           status: "ORDER PLACED",
//           cancel: 0,
//           category: cartProduct[i].category,
//           cod:0,
//           totalAmount:0
//         })
//         await newOrder.save();

//       }
//       req.session.razorpay=null
//       console.log(req.session.razorpay +"after razorpay online payment")

//     }
//     else {

//       console.log("enetered into the condition to cod payment")

//       for (let i = 0; i < cartProduct.length; i++) {
//         console.log("enteredc into the forloop")
//         console.log(cartProduct)
//         console.log(cartProduct[i].quantity)
//         console.log(cartProduct[i].productname)
//         const newOrder = new orderData({
//           username: req.session.username,
//           quantity: cartProduct[i].quantity,
//           productname: cartProduct[i].productname,
//           price: cartProduct[i].price,
//           orderdate: date,
//           image: cartProduct[i].imagepath,
//           orderId: otpValue.OTP,
//           address: {
//             pincode: req.session.userAddress.pincode,
//             state: req.session.userAddress.state,
//             city: req.session.userAddress.city,
//             housename: req.session.userAddress.housename,
//             district: req.session.userAddress.district,
//             country: req.session.userAddress.country,

//           },
//           status: "ORDER PLACED",
//           cancel: 0,
//           category: cartProduct[i].category,
//           cod:1,
//           totalAmount:0
//         })
//         await newOrder.save();

//       }
//     }

//     const order = await orderData.find({ orderId: otp })
//     console.log(order)
//     req.session.couponId=null 

//     console.log(req.session.username)

//     console.log("before delete the cart")


//     const deleteCartData = await cartData.deleteMany({ username: req.session.username })

//     console.log(deleteCartData)


//     // console.log(cartProduct[0].productname)
//     // console.log(cartProduct[0].price)
//     res.render("userOrders", { order, success: "Order Placed Successfull" })

//   }
//   catch (e) {
//     console.log("problem withe the cashOnDekivery" + e)
//     res.redirect("/error")
//   }



// }




const cancelOrder = async (req, res) => {

  try {

    console.log(req.query.orderId)
    console.log(req.query.proId)

    await orderData.updateOne({ orderId: req.query.orderId, productname: req.query.proId }, { $set: { status: "CANCELLED" } })
    const orderD = await orderData.findOne({ orderId: req.query.orderId, productname: req.query.proId })
    // await userData.updateOne({username:req.session.username },{ $set:{ wallet:orderD.price}})
    if (orderD.cod == 0) {
      await user.updateOne({ username: req.session.username }, { $inc: { wallet: orderD.totalAmount } });
    }

    res.redirect("/userorders")

  }
  catch (e) {

    console.log("problem withe the cancelOrder" + e)
    res.redirect("/error")

  }


}


const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

const createOrder = async (req, res) => {
  try {

    console.log(req.session.couponId)
    const checkCoupon = await CouponData.findOne({ couponId: req.session.couponId })
    console.log(req.body.price + " value money")
    let couponAmount
    let amount
    if (checkCoupon) {
      console.log('coupon applied for this products')
      couponAmount = req.body.price - checkCoupon.amount
      console.log(couponAmount)
      amount = couponAmount 
      console.log(amount + "cehck")


    } else {
      console.log('coupon not applied for this product')
      couponAmount = req.body.price
      console.log(couponAmount)
      amount = couponAmount
      console.log(amount + "cehck")

    }


    
    console.log(req.session.walletOrder)

    if (req.session.walletOrder) {
      const ogwallet = await user.findOne({ email: req.session.email })
      ///////////////////////////////////////////////////////////code for the wallet update
      let wallet = ogwallet.wallet - amount;
      if (wallet < 0) {
        wallet = 0;
      }
      console.log(wallet + " wallet amount of the order")
      await user.updateOne({ username: req.session.username }, { $set: { wallet: wallet} });
      /////////////////////////////////////////////////////////////////////////
      console.log("wallet presented =====")
     
      console.log(ogwallet.wallet)
      amount = amount - ogwallet.wallet
          if (amount < 1) {
            amount = 1
          }

    } else {
      console.log("wallet  NOTTTTTT  presented =====")
      amount = amount

    }
// i removed *100 check og code------------------------------
amount = amount*100

    console.log(amount + " amount after applying wallet")

   

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'razorUser@gmail.com'
    }
    console.log('1')
    req.session.razorpay = 22
    console.log(req.session.razorpay + " here razaorpay session live or not")
    razorpayInstance.orders.create(options,
      (err, order) => {
        console.log("2")
        if (!err) {
          console.log('3')
          res.status(200).send({
            success: true,
            msg: 'Order Created',
            order_id: order.id,
            amount: amount,
            key_id: process.env.RAZORPAY_ID_KEY,
            //product_name:req.body.name,
            // description:req.body.description,
            //contact:"8567345632",
            //name: "Sandeep Sharma",
            //email: "sandeep@gmail.com"
          });


        }
        else {
          console.log("error with razorpay")
          res.status(400).send({ success: false, msg: 'Something went wrong!' });
        }
      }
    );

  } catch (error) {
    console.log(error.message);
    res.redirect("/error")
  }
}



const fetchAdress = async (req, res) => {

  try {


    console.log(req.body.addressId)

    var id = new mongoose.Types.ObjectId(req.body.addressId);


    const addressD = await addressData.findOne({ _id: id })

    console.log(addressD.fullname)
    let fullname = addressD.fullname
    let phonenumber = addressD.phonenumber
    let country = addressD.address.country
    let state = addressD.address.state
    let pincode = addressD.address.pincode
    let district = addressD.address.district
    let city = addressD.address.city
    let housename = addressD.address.housename

    res.json({ fullname, phonenumber, country, state, pincode, district, city, housename })

  } catch (e) {
    console.log("problem withe the fetchAdress" + e)
    res.redirect("/error")
  }

}




const couponVerify = async (req, res) => {
  try {


    console.log(req.body.couponId)
    console.log(req.body.price)
    let totalAmount = req.body.price
    const checkCoupon = await CouponData.findOne({ couponId: req.body.couponId })
    console.log(checkCoupon)
    const couponArrayCheck = await user.findOne({ $and: [{ email: req.session.email }, { couponArray: { $in: [req.body.couponId] } }] })
    console.log("checking the elemet in present in the coupon array" + couponArrayCheck)


    const totalprice = await cartData.aggregate([
      {
        $match: { username: req.session.username }
      },
      {
        $group: { _id: "$productname", price: { $sum: "$price" }, quantity: { $sum: "$quantity" } }
      },
      {
        $project: { _id: 0, amount: { $multiply: ["$price", "$quantity"] } }
      },
      {
        $group: { _id: "null", total: { $sum: "$amount" } }
      }
    ])


    console.log(totalprice)

    if (checkCoupon) {
      if (totalAmount >= checkCoupon.minAmount) {
        let date = Date.now()
        console.log(date)

        const date1 = new Date(Number(date))
        console.log(date1)
        console.log(checkCoupon.endDate)

        const dateFirst = new Date(date1);
        const dateSecond = new Date(checkCoupon.endDate);


        if (dateFirst.getTime() < dateSecond.getTime()) {

          if (couponArrayCheck) {
            let totalValue = totalprice[0].total - checkCoupon.amount
            let total = totalprice[0].total
            console.log("Entered into the couponArrayCheck")
            let msg = "Coupon Already Applied"
            return res.json({ success: false, msg, totalValue, total })

          } else {
            let cost = totalAmount - checkCoupon.amount
            if (cost < 1) {
              console.log("price is negative")
              // let msg ="You cant Purchase "
              let totalAmount = totalprice[0].total
              cost = 1
              let inform = "Coupon has Applied: 1"
              let msg="Coupon has Successfully Applied"
              req.session.couponId = req.body.couponId
              return res.json({ success: true, cost,msg, inform, totalAmount })

            } else {
              console.log(cost)
              console.log(req.session.email)
              const pushcoupon = await user.updateOne({ email: req.session.email }, { $push: { couponArray: req.body.couponId } })
              console.log(pushcoupon)
              let inform = `Coupon Applied :${checkCoupon.amount}`
              console.log("about the discount cost" + cost)
              console.log("about the total cost" + totalAmount)
              req.session.couponId = req.body.couponId
              let msg="Coupon has Successfully Applied"
              return res.json({ success: true, cost,msg, inform, totalAmount })
            }
          }

        } else {

          console.log("no the checkcoupom")
          let msg = "Coupon Date has Expired"
          return res.json({ success: false, msg })
        }

      } else {
        console.log("no the amount")
        let msg = `Minimum Amount to Apply Coupon:${checkCoupon.minAmount}`
        return res.json({ success: false, msg })

      }


    } else {
      console.log("no the checkcoupom")
      let msg = "Enter Valid Coupon Id"
      return res.json({ success: false, msg })
    }

  } catch (e) {
    console.log("Problem with the couponVerify" + e)
    return res.json({ success: false, msg: "Internal Server Error" })
  }
}





const removeCoupon = async (req, res) => {
  try {
    console.log("entered into remove coupon")
    console.log(req.session.couponId)
    const checkCoupon = await CouponData.findOne({ couponId: req.session.couponId })
    console.log(checkCoupon)
    console.log(req.session.email)
    try {
      const pullcoupon = await user.updateOne({ email: req.session.email }, { $pull: { couponArray: req.session.couponId } });
      console.log('Coupon removed successfully:', pullcoupon);
      // Send a success response or perform additional actions if needed
    } catch (error) {
      console.error('Error removing coupon:', error);
      // Handle the error, send an appropriate response, or retry the operation
    }

    // const pullcoupon = await user.updateOne({ email:req.session.email }, { $pull: { couponArray: req.body.couponId } })
    // console.log(pullcoupon)
    console.log(checkCoupon.amount)
    let removeTotal = req.body.price
    console.log(removeTotal)
    req.session.couponId = null
    let msg = "Removed Coupon from Total Amount"
    return res.json({ success: true,msg, removeTotal })

  } catch (e) {
    console.log("problem withe the removeCoupon" + e)
    res.redirect("/error")
  }
}








// const couponVerify = async (req, res) => {
//   try {


//     console.log(req.body.couponId)
//     console.log(req.body.price)
//     let totalAmount = req.body.price
//     const checkCoupon = await CouponData.findOne({ couponId: req.body.couponId })
//     console.log(checkCoupon)
//     const couponArrayCheck = await user.findOne({ $and: [{ email: req.session.email }, { couponArray: { $in: [req.body.couponId] } }] })
//     console.log("checking the elemet in present in the coupon array" + couponArrayCheck)


//     const totalprice = await cartData.aggregate([
//       {
//         $match: { username: req.session.username }
//       },
//       {
//         $group: { _id: "$productname", price: { $sum: "$price" }, quantity: { $sum: "$quantity" } }
//       },
//       {
//         $project: { _id: 0, amount: { $multiply: ["$price", "$quantity"] } }
//       },
//       {
//         $group: { _id: "null", total: { $sum: "$amount" } }
//       }
//     ])


//     console.log(totalprice)

//     if (checkCoupon) {
//       if (totalAmount >= checkCoupon.minAmount) {
//         let date = Date.now()
//         console.log(date)

//         const date1 = new Date(Number(date))
//         console.log(date1)
//         console.log(checkCoupon.endDate)

//         const dateFirst = new Date(date1);
//         const dateSecond = new Date(checkCoupon.endDate);


//         if (dateFirst.getTime() < dateSecond.getTime()) {

//           if (couponArrayCheck) {
//             let totalValue = totalprice[0].total - checkCoupon.amount
//             let total = totalprice[0].total
//             console.log("Entered into the couponArrayCheck")
//             let msg = "Coupon Already Applied"
//             return res.json({ success: false, msg, totalValue, total })

//           } else {
//             let cost = totalAmount - checkCoupon.amount
//             if (cost < 1) {
//               console.log("price is negative")
//               // let msg ="You cant Purchase "
//               let totalAmount = totalprice[0].total
//               cost = 1
//               let inform = "Coupon has Applied: 1"
//               req.session.couponId = req.body.couponId
//               return res.json({ success: true, cost, inform, totalAmount })

//             } else {
//               console.log(cost)
//               console.log(req.session.email)
//               const pushcoupon = await user.updateOne({ email: req.session.email }, { $push: { couponArray: req.body.couponId } })
//               console.log(pushcoupon)
//               let inform = `Coupon Applied :${checkCoupon.amount}`
//               console.log("about the discount cost" + cost)
//               console.log("about the total cost" + totalAmount)
//               req.session.couponId = req.body.couponId
//               return res.json({ success: true, cost, inform, totalAmount })
//             }
//           }

//         } else {

//           console.log("no the checkcoupom")
//           let msg = "Coupon Date has Expired"
//           return res.json({ success: false, msg })
//         }

//       } else {
//         console.log("no the amount")
//         let msg = `Minimum Amount to Apply Coupon:${checkCoupon.minAmount}`
//         return res.json({ success: false, msg })

//       }


//     } else {
//       console.log("no the checkcoupom")
//       let msg = "Enter Valid Coupon Id"
//       return res.json({ success: false, msg })
//     }

//   } catch (e) {
//     console.log("Problem with the couponVerify" + e)
//     return res.json({ success: false, msg: "Internal Server Error" })
//   }
// }




// const removeCoupon = async (req, res) => {
//   try {
//     console.log("entered into remove coupon")
//     console.log(req.session.couponId)
//     const checkCoupon = await CouponData.findOne({ couponId: req.session.couponId })
//     console.log(checkCoupon)
//     console.log(req.session.email)
//     try {
//       const pullcoupon = await user.updateOne({ email: req.session.email }, { $pull: { couponArray: req.session.couponId } });
//       console.log('Coupon removed successfully:', pullcoupon);
//       // Send a success response or perform additional actions if needed
//     } catch (error) {
//       console.error('Error removing coupon:', error);
//       // Handle the error, send an appropriate response, or retry the operation
//     }

//     // const pullcoupon = await user.updateOne({ email:req.session.email }, { $pull: { couponArray: req.body.couponId } })
//     // console.log(pullcoupon)
//     console.log(checkCoupon.amount)
//     let removeTotal = req.body.price
//     console.log(removeTotal)
//     req.session.couponId = null
//     let msg = "Removed Coupon from Total Amount"
//     return res.json({ success: true, removeTotal })

//   } catch (e) {
//     console.log("problem withe the removeCoupon" + e)
//     res.redirect("/error")
//   }
// }


const returnOrder = async (req, res) => {
  try {

    console.log(req.query.orderId)
    console.log(req.query.proId)

    console.log(req.body)

    await orderData.updateOne({ orderId: req.query.orderId, productname: req.query.proId }, { $set: { status: "REQUEST TO RETURN", reason: req.body.reason } })
    res.redirect("/userorders")

  } catch (e) {
    console.log("problem with the returnOrder" + e)
    res.redirect("/error")
  }
}

const walletApply = async (req, res) => {
  try {

    console.log("entered in to the fetch of walletApply")
    console.log(req.body.wallet)
    console.log(req.body.price)
    ogamount = req.body.price
    const ogwallet = await user.findOne({ email: req.session.email })
    console.log(ogwallet.wallet)
    let removeWallet = req.body.price - ogwallet.wallet

    if (removeWallet < 1) {
      removeWallet = 1
    }

    // let wallet=ogwallet.wallet-req.body.price
    let wallet = ogwallet.wallet - req.body.price;
    if (wallet < 0) {
      wallet = 0;
    }

    /////////////////////////////

    req.session.walletOrder = 11
    console.log(req.session.walletOrder + "wallet amount in applying")
    //////////////////////////////////

    return res.json({ success: true, removeWallet, ogamount, wallet })

  } catch (e) {
    console.log("problem with the the walletApply" + e)
    res.redirect("/error")
  }
}



const walletRemove = async (req, res) => {
  try {

    console.log("entered in to the fetch of walletRemove")

    console.log(req.body.price)
    // ogamount=req.body.price
    let removeWallet = req.body.price
    const ogwallet = await user.findOne({ email: req.session.email })
    console.log(ogwallet.wallet)
    let wallet = ogwallet.wallet

    /////////////////////////////
    req.session.walletOrder = null
    //////////////////////////////////

    return res.json({ success: true, removeWallet, wallet })

  } catch (e) {
    console.log("problem with the the walletApply" + e)
    res.redirect("/error")
  }
}








//INVOICE

const invoice=async (req,res)=>{
  //data
  console.log(req.query.orderId)
const orders=await orderData.find({orderId:req.query.orderId})
  //data


// copy
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
  <style>
      /! tailwindcss v3.0.12 | MIT License | https://tailwindcss.com/,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:initial;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:initial}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none},:after,:before{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.flex{display:flex}.table{display:table}.table-cell{display:table-cell}.table-header-group{display:table-header-group}.table-row-group{display:table-row-group}.table-row{display:table-row}.hidden{display:none}.w-60{width:15rem}.w-40{width:10rem}.w-full{width:100%}.w-\[12rem\]{width:12rem}.w-9\/12{width:75%}.w-3\/12{width:25%}.w-6\/12{width:50%}.w-2\/12{width:16.666667%}.w-\[10\%\]{width:10%}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.justify-center{justify-content:center}.rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.border-x-\[1px\]{border-left-width:1px;border-right-width:1px}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.p-10{padding:2.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pl-4{padding-left:1rem}.pb-20{padding-bottom:5rem}.pb-16{padding-bottom:4rem}.pb-1{padding-bottom:.25rem}.pb-2{padding-bottom:.5rem}.pt-20{padding-top:5rem}.pr-10{padding-right:2.5rem}.pl-24{padding-left:6rem}.pb-6{padding-bottom:1.5rem}.pl-10{padding-left:2.5rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-normal{font-weight:400}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175/var(--tw-text-opacity))}.text-black{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}
  </style>
</head>
<body>
  <div class="p-10">
      <!--Logo and Other info-->
      <div class="flex items-start justify-center">
          <div class="flex-1">
              <div class="w-60 pb-6">
                  <img class="w-40" src="https://www.freeiconspng.com/uploads/black-shopping-cart-icon-25.jpg" alt="Logo">
              </div>
              
              <div class="w-60 pl-4 pb-6">
                  <h3 class="font-bold">Frutable</h3>
                  <p>HSR Layout</p>
                  <p>Banglore 560102</p>
              </div>
              
              <div class="pl-4 pb-20">
                  <p class="text-gray-500">Bill To:</p>
                  <h3 class="font-bold">${orders[0].name}</h3>
              </div>
              
          </div>
          <div class="flex items-end flex-col">

              <div class="pb-16">
                  <h1 class=" font-normal text-4xl pb-1">Delivery Report</h1>
                  <br><p class="text-right text-gray-500 text-xl">invoice</p>
                  <p class="text-right text-gray-500 text-xl"># ${orders[0].orderId}</p>
              </div>

              <div class="flex">
                  <div class="flex flex-col items-end">
                      <p class="text-gray-500 py-1">Date:</p>
                      <p class="text-gray-500 py-1">Payment Method:</p>
                      <p class="font-bold text-xl py-1 pb-2 ">TOTAL:</p>
                  </div>
                  <div class="flex flex-col items-end w-[12rem] text-right">
                      <p class="py-1">${orders[0].orderDate}</p>
                      <p class="py-1 pl-10">${orders[0].payment}</p>
                      <div class="pb-2 py-1">
                          <p class="font-bold text-xl">₹${orders[0].totalPrice}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <!--Items List-->
      <div class="table w-full">
          <div class=" table-header-group bg-gray-700 text-white ">
              <div class=" table-row ">
                  <div class=" table-cell w-6/12 text-left py-2 px-4 rounded-l-lg border-x-[1px]">Item</div>
                  <div class=" table-cell w-[10%] text-center border-x-[1px]">Quantity</div>
                  <div class=" table-cell w-2/12 text-center border-x-[1px]">Rate</div>
                  <div class=" table-cell w-2/12 text-center rounded-r-lg border-x-[1px]">Amount</div>
              </div>
          </div>

          <div class="table-row-group">
              ${getDeliveryItemsHTML(orders)}
          </div>
      </div>
      
      <!--Total Amount-->
      <div class=" pt-20 pr-10 text-right">
          <p class="text-gray-400">Total: <span class="pl-24 text-black">₹${orders[0].totalPrice}</span></p>
      </div>

      <!--Notes and Other info-->
      <div class="py-6">
          <p class="text-gray-400 pb-2">Notes:</p>
          <p>Thank you for being a Awesome customer!</p>
      </div>

      <div class="">
          <p class="text-gray-400 pb-2">Terms:</p>
          <p>Invoice is Auto generated at the time of delivery,if there is any issue contact provider.</p>
      </div>
  </div>
</body>
</html>
`;



//table function for inserting dynamic product details into invoice
function getDeliveryItemsHTML(orders){
  let data = ""
  for(let order of orders){
      data += `
  <div class="table-row">
      <div class=" table-cell w-6/12 text-left font-bold py-1 px-4">${order.product}</div>
      <div class=" table-cell w-[10%] text-center">${order.quantity}</div>
      <div class=" table-cell w-2/12 text-center">₹${order.price}</div>
      <div class=" table-cell w-2/12 text-center">₹${order.price*order.quantity}</div>
  </div>
  `
  }
  return data
}

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(htmlContent);


const pdfBuffer = await page.pdf();

await browser.close();

const downloadsPath = path.join(os.homedir(), "Downloads");
const pdfFilePath = path.join(downloadsPath, "invoice.pdf");


fs.writeFileSync(pdfFilePath, pdfBuffer);

res.setHeader("Content-Length", pdfBuffer.length);
res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
res.status(200).end(pdfBuffer);
// copy
}






module.exports = { displayCheckout, displayOrder, cashOnDelivery, cancelOrder, createOrder, fetchAdress, couponVerify, removeCoupon, returnOrder, walletApply, walletRemove,invoice }