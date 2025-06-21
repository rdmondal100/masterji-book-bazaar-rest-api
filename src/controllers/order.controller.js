import { asyncHandler } from "../lib/asyncHandler.js";
import { Book } from "../models/book.model.js";
import { ApiResponse } from "../lib/apiResponse.js";
import { ApiError } from "../lib/apiError.js";
import { validationResult } from "express-validator";
import { CartItem } from "../models/cartItem.model.js";
import { Order } from "../models/order.model.js";
import { sendEmail } from "../lib/email/sendEmail.js";
 
export const addToCart = asyncHandler(async (req, res) => {
  const { book, quantity } = req.body;
  
  console.log(req.user._id)
  const bookItem = await Book.findById(book)
  console.log("bookItem")
  console.log(bookItem)
  if(quantity > bookItem.stock){
    throw new ApiError(400,`Only ${bookItem.stock} items are left. You can not buy more than ${bookItem.stock} at this time!`)

  }
  const cartItem = await CartItem.create({
    user: req.user._id,
    book,
    quantity,
  });

  console.log("cartItem is : ");
  console.log(cartItem);
  const response = new ApiResponse(
    200,
    { cartItem },
    "Book added to cart  successfully"
  );

  return res.status(response.statusCode).json(response);
});


export const createOrder = asyncHandler(async (req, res) => {
  const {shippingAddress} = req.body
  const cartItem = await CartItem.find({
    user: req.user._id,
  }).populate("book");

  if (cartItem.length === 0) {
    throw new ApiError(400, "Cart is empty! First add item to cart");
  }

  let totalAmount = 0;
  const items = cartItem.map((item) => {
    totalAmount += item.quantity * item.book.price;
    return {
      book: item.book._id,
      quantity: item.quantity,
      price: item.book.price,
    };
  });

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress
  });

  if (!order) {
    throw new ApiError(400, "Failed to create order");
  }


 console.log(req.user.email)
 console.log(req.user)

 await sendEmail("ORDER_PLACED",req.user.email,{orderId:order._id.toString()})

    await CartItem.deleteMany({ user: req.user._id });


  const response = new ApiResponse(201,{order},"Order created successfylly.You will get an conformation email soon. Note: it will send to the mailtrap as it is testing")

  return res 
        .status(response.statusCode)
        .json(response)


});


export const getAllOrdersForUser = asyncHandler(async(req,res)=>{

  const userId = req.user._id
  if(!userId){
    throw new ApiError(400,"Failed to get user id from the reqest!")

  }

  const userOrders = await Order.find({user:userId})
  console.log(userOrders)

  if(!userOrders){
    throw new ApiError(400,"Failed to get all orders!")
  }


  const response = new ApiResponse(200,{userOrders},"Get all orders successfylly")


  return res 
        .status(response.statusCode)
        .json(response)

})


export const getOrderDetailsById = asyncHandler(async(req,res)=>{

  const orderId = req.params.id 

  if(!orderId){
    throw new ApiError(400,"Failed to get user id from the parameter!")

  }

  const order = await Order.findById(orderId)
  console.log(order)

  if(!order){
    throw new ApiError(400,"Failed to get order!")
  }


  const response = new ApiResponse(200,{order},"Get order details successfylly")


  return res 
        .status(response.statusCode)
        .json(response)

})