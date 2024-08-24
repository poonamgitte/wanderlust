//Basic Setup
const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");        //Install ejs-mate npm package
//-+ ejs-mate is a npm package that is used for boilerplate(i,e. to use similar layout in multiple pages)
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");   //Validation Schema
const Review = require("./models/review.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));    //This is used to use static files as css

app.get("/",(req,res)=>{
    res.send("Hi, I am root");
})

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
})

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

//Schema validation function
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }
        else{
            next();
        }
}

//Index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    })
);

//New route
app.get ("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Show route
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show.ejs",{listing});
// }));

app.get("/listings/:id", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('reviews').exec();
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show.ejs", { listing }); // Adjust the view name as necessary
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

//Create Route
app.post("/listings",validateListing,
     wrapAsync( async(req,res,next)=>{
        //let {title, description, image, price, country, location} = req.body;
        // or 

        // if(!req.body.listing) {
        //     throw new ExpressError(400,"Send valid data for listing");
        // } 
        //Instead of using multiple if statements for schema validation we can use joi as follow

        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update route
app.put("/listings/:id",validateListing,
    wrapAsync(async (req,res)=>{

    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
 
//Delete route
app.delete("/listings/:id",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//Review
// app.post("/listings/:id/reviews",validateListing, wrapAsync (async(req,res)=>{
//     let listing =await Listing.findById(req.params.id);
//      let newReview = new Review (req.body.review);

//      listing.reviews.push(newReview);

//      await newReview.save();
//     await listing.save();

//      res.redirect(`/listings/${listing._id}`);
//  }));

 app.post("/listings/:id/reviews",validateListing, wrapAsync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
     let newReview = new Review (req.body.review);

     listing.reviews.push(newReview);

     await newReview.save();
    await listing.save();

     res.redirect(`/listings/${id}`);
 }));


//Middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
});


