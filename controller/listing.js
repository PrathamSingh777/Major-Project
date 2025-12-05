Listing = require("../models/listing")
module.exports.index = async(req,res)=>{
   const  allListings = await Listing.find({});
   res.render("listings/index",{allListings});
};


module.exports.newform = async (req, res) => {  
   res.render("listings/new");
};

module.exports.showroutes = async(req,res)=>{
  let{id} = req.params;
  let  listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}})
  .populate("owner");
  if(!listing){
   req.flash("error","listing does not  exists ");
  return res.redirect("/listings");
  }
   res.render("listings/show",{listing});
};

module.exports.createlisting = async ( req, res ,next) => {
    let url = req.file.path;
      let filename = req.file.filename;
      
        const newListing = new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image.url = url;
        newListing.image.filename = filename;
        await newListing.save();
        req.flash("success","new listing created");
        res.redirect("/listings");

};
 
module.exports.editlisting = async(req,res)=>{
   let{id} = req.params;
   let  listing = await Listing.findById(id)
    if(!listing){
   req.flash("error","listing you are seeing for edit does exists ");
  return res.redirect("/listings");
  }

  let originalImgUrl = listing.image.url;
  originalImgUrl = originalImgUrl.replace("/upload","/upload/w_300,h_200");
      res.render("listings/edit",{listing,originalImgUrl}) ;
};

module.exports.updatelisting=async(req,res)=>{
   let {id}=req.params;
   let listing = await Listing.findById(id);
   if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect(`/listings`);
   }
 // If the form submitted an `image` field as a string (from the file input),
 // remove it so we don't overwrite the image object in the DB with a string.
 if (req.body && req.body.listing && typeof req.body.listing.image === 'string') {
    delete req.body.listing.image;
 }

 // Update and return the updated document
 let newlisting = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });

 // If a new file was uploaded, set the image object properly.
 if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    // replace the image subdocument with an object
    newlisting.image = { url, filename };
    await newlisting.save();
 }
  req.flash("success"," listing updated");
res.redirect(`/listings/${id}`)
};

module.exports.deletelisting= async(req,res)=>{
   let {id} = req.params;
   let deletedlisting =  await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
    req.flash("success","listing Deleted");
   res.redirect("/listings");
}