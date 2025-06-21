import { asyncHandler } from "../lib/asyncHandler.js";
import { Book } from "../models/book.model.js";
import { ApiResponse } from "../lib/apiResponse.js";
import { ApiError } from "../lib/apiError.js";
import { validationResult } from "express-validator";
import qs from "qs";


export const addBooks = asyncHandler(async (req, res) => {
  //error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "Register validation failed", extractedErrors);
  }

  const book = await Book.create(req.body);
  console.log("New book created");
  console.log(book);
  if (!book) {
    throw ApiError(400, "Failed to create new book, Please try agian!");
  }
  const response = new ApiResponse(
    201,
    { book },
    "New book created successfylly"
  );

  return res.status(response.statusCode).json(response);
});
 

export const getAllBooks = asyncHandler(async (req, res) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "Query validation failed", extractedErrors);
  }

  // Parse query 
  const queryObj = qs.parse(req.query);
  const excludeFields = ["page", "sort", "limit", "fields", "search"];
  excludeFields.forEach((el) => delete queryObj[el]);

   if (queryObj.genre && typeof queryObj.genre === "string" && queryObj.genre.includes(",")) {
    queryObj.genre = { $in: queryObj.genre.split(",") };
  }

   let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const mongoQuery = JSON.parse(queryStr);

   if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i"); // case-insensitive
    mongoQuery.$or = [
      { title: { $regex: searchRegex } },
      { author: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
    ];
  }

   let query = Book.find(mongoQuery);

   if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 8;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Execute
  const books = await query;
  const total = await Book.countDocuments(mongoQuery);

  const response = new ApiResponse(
    200,
    { total, page, limit, books },
    "Fetched books successfully"
  );

  return res.status(response.statusCode).json(response);
});


export const getBookDetailsById = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  if (!bookId) {
    throw new ApiError(400, "Failed to get book id on parameter");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, `Book not found with id: ${bookId}`);
  }

  const response = new ApiResponse(200, { book }, "Fetched book successfully");

  return res.status(response.statusCode).json(response);
});

export const updateBookDetailsById = asyncHandler(async (req, res) => {
  //error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "Register validation failed", extractedErrors);
  }

  const bookId = req.params.id;

  if (!bookId) {
    throw new ApiError(400, "Failed to get bookId from parameter");
  }

  const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) {
    throw new ApiError(404, `Book not found with id: ${bookId}`);
  }

  const response = new ApiResponse(
    200,
    { updatedBook },
    "Book updated successfully"
  );

  return res.status(response.statusCode).json(response);
});

export const deleteBookById = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  if (!bookId) {
    throw new ApiError(400, "Failed to get bookId from parameter");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, `Book not found with id: ${bookId}`);
  }

  const bookDeleted = await book.deleteOne();
  if(!bookDeleted){
    throw new ApiError(400,"Failed to delete the book, Please try agian!")
    
  }
  const response = new ApiResponse(
    200,
    { bookDeleted },
    "Book Deleted successfylly"
  );
  return res.status(response.statusCode).json(response);
});
