import { validationResult } from "express-validator";
import { ApiError } from "../lib/apiError.js";
import { ApiResponse } from "../lib/apiResponse.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { Book } from "../models/book.model.js";
import { Review } from "../models/review.model.js";


export const addReview = asyncHandler(async(req,res)=>{
 //error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "Add review validation failed", extractedErrors);
  }


const bookId = req.params.bookId
const user = req.user._id
const {rating,comment} = req.body


if(!bookId){
    throw new ApiError(400,"Failed to get book id from params")
}
if(!user){
        throw new ApiError(400,"Failed to get auth user")

}

const book = await Book.findById(bookId)
if(!book){
    throw new ApiError(404,`Book not found with id ${bookId}`)
}

const review = await Review.create({
    book:bookId,
    user,
    rating,
    comment
})

if(!review){
    throw new ApiError(400,"Failed to create review")
}

const response = new ApiResponse(201,{review},"Review created successfylly")

return res
        .status(response.statusCode)
        .json(response)

})



export const getAllReviewsForBook = asyncHandler(async(req,res)=>{
 //error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "Get all reviews validation failed", extractedErrors);
  }


const bookId = req.params.bookId


if(!bookId){
    throw new ApiError(400,"Failed to get book id from params")
}
 

const review = await Review.find({
    book:bookId
})

if(!review){
    throw new ApiError(400,"Failed to get all reviews")
}

const response = new ApiResponse(200,{review},"Get all review successfylly")

return res
        .status(response.statusCode)
        .json(response)
})


export const deleteReviewById = asyncHandler(async(req,res)=>{

     //error validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
          failed: err.param,
          message: err.msg,
        }));
        throw new ApiError(400, "deleteReview validation failed", extractedErrors);
      }
    

    const reviewId = req.params.id
    if(!reviewId){
    throw new ApiError(400,"Failed to get review id from params")
}

const review = await Review.findById(reviewId)

if(!review){
    throw new ApiError(400,`Review not found with id ${reviewId}`)
}

// check if it is the owner 
if(review.user.toString() !== req.user._id && req.user.role !=='admin'){
    throw new ApiError(403,'Not authorized to delete this review',)
}

await review.deleteOne()

const response = new ApiResponse(200,{},"Review deleted successfully")

return res 
        .status(response.statusCode)
        .json(response)



})