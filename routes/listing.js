const express = require("express");
const router = express.Router();
const Listing =require("../models/listing.js");
const asyncwrap = require("../utils/asyncwrap.js");
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");    
const reviews = require("../models/reviews.js");
const listingcontroller = require ("../controller/listing");

const multer  = require('multer');
 const{storage}=require("../cloudConfig.js");
 //const { cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/") 
.get (asyncwrap (listingcontroller.index))
.post(isLoggedIn,   
    upload.single("listing[image]"),validateListing , asyncwrap (listingcontroller.createlisting));


//new route 
router.get("/new", isLoggedIn,asyncwrap(listingcontroller.newform));


router.route("/:id")
.get ( asyncwrap (listingcontroller.showroutes))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing ,  asyncwrap (listingcontroller.updatelisting))
.delete(isLoggedIn, isOwner,asyncwrap (listingcontroller.deletelisting));


// edit route 
router.get("/:id/edit",  isLoggedIn,isOwner,asyncwrap (listingcontroller.editlisting));


module.exports = router;