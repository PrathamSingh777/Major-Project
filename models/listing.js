const mongoose = require("mongoose");
const Review = require("./reviews.js");
const schema = mongoose.Schema;

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String

  },
  price: {
    type: Number,
    required: true ,min:0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },

  reviews :[ {
    type : schema.Types.ObjectId,
    ref:"Review"
  }],
   owner: {
  type: schema.Types.ObjectId,
  ref: "User"
}

  
});


listingSchema.post("findOneAndDelete", async(listing)=>{
  if (listing){
  await Review.deleteMany({_id :{$in:listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


