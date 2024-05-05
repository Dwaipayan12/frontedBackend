const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
// app.use(expressLayouts);


main().then((res)=>{
    console.log("connection sucessfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.get("/",(req,res)=>{
    res.send("root is working");
});

// app.get("/testListing",async (req,res)=>{
// let simpleListing = new Listing({
//     title:"My new House",
//     description:"By the beach",
//     price:1200,
//     location:"digha",
//     country:"India",
// });
// await simpleListing.save();
// console.log("Sample was saved");
// res.send("successful send");
// });

//index.route
app.get("/testListing", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Internal Server Error");
    }
});

//new roue
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

app.post("/listings", async (req, res) => {
    //let(title,description,image,price,country,location)=req.body;
//let listing=await req.body.listing;
//console.log(listing);
const newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/testListing");
});
//show route
//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        console.log("Listing found:", listing); // Log the retrieved listing object
        res.render("listings/show", { listing });
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).send("Internal Server Error");
    }
});
//for edit
app.get("/listings/:id/edit",async(req,res)=>{
    let { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        console.log("Listing found:", listing); // Log the retrieved listing object
        res.render("listings/edit", { listing });
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try {
        const updatedListingData = { ...req.body.listing };
        await Listing.findByIdAndUpdate(id, updatedListingData);
        res.redirect("/testListing");
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Delete rout
// DELETE route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try {
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log("Deleted listing:", deletedListing);
        res.redirect("/testListing");
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(8080,()=>{
    console.log("server is listening 8080");
}); 