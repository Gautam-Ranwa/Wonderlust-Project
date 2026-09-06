import express from "express";
const router = express.Router();
import Listing from "../models/listing.js";

// index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({})
    // console.log(allListings);
    res.render("./listings/index", { allListings })

})

//Create Route

router.get("/new", (req, res) => {
    res.render("./listings/new");
});

router.post("/", (req, res) => {
    let { title, description, image, price, country, location } = req.body;
    let NewListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        country: country,
        location: location
    }).save()
    console.log(NewListing);
    req.flash("success", "new listing created..!");
    res.redirect("/listings")
})

// find Route

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    // console.log(listing);
    res.render("./listings/show", { listing })
});

// edit Route

router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing })
})

// Update Route

router.put("/:id", async (req, res) => {
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

    res.redirect("/listings");
});
// delete Route

router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
});


export default router;
