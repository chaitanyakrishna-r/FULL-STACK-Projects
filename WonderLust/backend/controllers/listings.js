const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//index route
module.exports.index = async(req, res)=>{
    console.log(req.query.category);
    const listings = await Listing.find({});
    res.render("allList.ejs",{listings});
}

// create new form
module.exports.renderNewListing = (req,res)=>{
    res.render("newList.ejs");
 }

 // post for create new listing
module.exports.createListing = async(req, res)=>{
    
    //(we have create a validation schema middleware )
        // let result = listingSchema.validate(req.body);
        // console.log(result.error);

        // if(result.error){
        //     throw new ExpressErorr(400,result.error);
        // }
        const response = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        })
        .send();

       
        const {title, description,location, country, price} = req.body;
        const {path:url , filename} = req.file;
         // Check required fields explicitly
        // if (!title || !description || !location || !country || !price) {
        //     throw new ExpressErorr(400, "All fields are required for a valid listing");
        //  }
     
        const newListing = new Listing({
                title,
                description,
                location,
                country,
                price,
                image:{
                url:url ,
                filename:filename,
    
            }
        })
        newListing.owner = req.user._id;
        newListing.geometry = response.body.features[0].geometry;
        const saveListing = await newListing.save();
        req.flash("success","Listing created successfully");
        console.log(saveListing);
        res.redirect("/listing");
 
 }

 //show listings
 module.exports.showListing = async(req, res)=>{
     // console.log("show route");
     const {id} = req.params;
     const listing = await Listing.findById(id).populate({
         path:"reviews",
         populate:{
             path: "author"
         }
     }).populate("owner");
   
     
     if(!listing){
         req.flash("error","Listting you requested for does not exist!");
         return res.redirect("/listing");
     }
     //    console.log(listing);
         res.render("showList.ejs",{listing});
     
  }
  
  //edit form
  module.exports.renderEditListing = async(req, res)=>{
      const {id} = req.params;
      const redirectTo = req.query.redirectTo || "allListing";
      const editListing = await Listing.findById(id);
      if(!editListing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listing");
      }

      let originalImageUrl = editListing.image.url;
      originalImageUrl = originalImageUrl.replace("/upload","/upload/w_200");
      res.render("edit.ejs",{editListing, redirectTo,originalImageUrl});
  }

  //post: update 
  module.exports.updateListing = async(req, res)=>{
 
    const {id} = req.params;
   
    // const redirectTo = req.body.redirectTo;
    const redirectTo = req.query.redirectTo;
    // console.log("from update router but reqqueryredito",req.query.redirectTo);
    const {title,price, description, location, country } = req.body;

    const updateListing = await Listing.findByIdAndUpdate(id,{
        title: title,
        price: price,
        description: description,
        location: location,
        country: country,

    });

    if(req.file){
        const {path:url, filename} = req.file;
        updateListing.image = {url,filename};
        await updateListing.save();
    }
    
    //hadling redirect
    if(redirectTo === "show"){
        res.redirect(`/listing/${id}`);
    }else{
        res.redirect("/listing");
    }    
    
}

// Post: delete
module.exports.destroyListing = async(req, res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id); 
    req.flash("success","Listing Deleted successfully");
    res.redirect("/listing");
}