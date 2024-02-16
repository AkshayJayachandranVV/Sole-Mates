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
      await user.updateOne({ username: req.session.username }, { $inc: { wallet: orderD.price } });
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
      amount = couponAmount * 100
      console.log(amount + "cehck")


    } else {
      console.log('coupon not applied for this product')
      couponAmount = req.body.price
      console.log(couponAmount)
      amount = couponAmount * 100
      console.log(amount + "cehck")

    }

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
              req.session.couponId = req.body.couponId
              return res.json({ success: true, cost, inform, totalAmount })

            } else {
              console.log(cost)
              console.log(req.session.email)
              const pushcoupon = await user.updateOne({ email: req.session.email }, { $push: { couponArray: req.body.couponId } })
              console.log(pushcoupon)
              let inform = `Coupon Applied :${checkCoupon.amount}`
              console.log("about the discount cost" + cost)
              console.log("about the total cost" + totalAmount)
              req.session.couponId = req.body.couponId
              return res.json({ success: true, cost, inform, totalAmount })
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


// const onlinePayment=async(req,res)=>{
//   try{


//     let razorpay=razorpayPayment.razorpayOnlinePayment

//     console.log(razorpay)


//   }
//   catch(e){
//     console.log("Problem with the onmlinePayment "+e)

//   }
// }



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
    return res.json({ success: true, removeTotal })

  } catch (e) {
    console.log("problem withe the removeCoupon" + e)
    res.redirect("/error")
  }
}


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

module.exports = { displayCheckout, displayOrder, cashOnDelivery, cancelOrder, createOrder, fetchAdress, couponVerify, removeCoupon, returnOrder, walletApply, walletRemove }