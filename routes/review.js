const express = require("express");
 const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Review =require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {reviewschema} = require("../schema.js");
const{validatereview, isLoggedIn,isreviewAuthor} = require("../middleware.js")
const reviewcontroller = require("../controller/review")
 // reviews route
 //post
 
 router.post("/",  isLoggedIn, validatereview , asyncwrap (reviewcontroller.reviewpost ))
 
 //delete reviews
router.delete("/:reviewId" ,isLoggedIn,isreviewAuthor,asyncwrap(reviewcontroller.deletereview));

 module.exports = router;