const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1195433295/photo/surreal-landscape-with-a-split-road-and-signpost-arrows-showing-two-different-courses-left.webp?b=1&s=170667a&w=0&k=20&c=spFLsCNioscaGQixbSvDlknXRiqTsYD2KPT534gBViA=",
        set: (v) => v === "" ? "https://media.istockphoto.com/id/1195433295/photo/surreal-landscape-with-a-split-road-and-signpost-arrows-showing-two-different-courses-left.webp?b=1&s=170667a&w=0&k=20&c=spFLsCNioscaGQixbSvDlknXRiqTsYD2KPT534gBViA=" 
        : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;