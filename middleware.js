const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema, reviewschema } = require("./schema.js");

//Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

//  Save redirect URL (for post-login redirect)
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//  Ensure the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // ObjectId safe comparison
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


//  Validate new or edited listing data
module.exports.validateListing = (req, res, next) => {
  const { error } = listingschema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

//  Validate new review data
module.exports.validatereview = (req, res, next) => {
  const { error } = reviewschema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};

//  Ensure the current user is the author of the review
module.exports.isreviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to delete this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};











