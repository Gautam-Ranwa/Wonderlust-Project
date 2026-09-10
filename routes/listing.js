import express from "express";
const router = express.Router();
import Listing from "../models/listing.js";
import isLoggedIn from "../middleware.js"
import { isOwner } from "../middleware.js";

// index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({})
    // console.log(allListings);
    res.render("./listings/index", { allListings })

})

//Create Route

router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listings/new");
});

router.post("/", isLoggedIn, async (req, res) => {
    let { title, description, image, price, country, location } = req.body;

    let NewListing = new Listing({
        title,
        description,
        image,
        price,
        country,
        location
    });
    NewListing.owner = req.user._id;

    await NewListing.save();

    req.flash("success", "new listing created..!");
    res.redirect("/listings");
});

// show Route

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
    if (!listing) {
        req.flash("error", "listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show", { listing })
});

// edit Route

router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing })
})

// Update Route

router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;

    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            title: req.body.title,
            description: req.body.description,
            image: {
                url: req.body.image,
            },
            price: req.body.price,
            country: req.body.country,
            location: req.body.location,
        },
        { new: true }
    );

    console.log(updatedListing);

    res.redirect(`/listings/${id}`);
});
// delete Route

router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
});


export default router;
