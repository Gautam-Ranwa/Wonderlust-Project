import express from "express";
import session from "express-session";
const app = express();

const port = 8080;

import mongoose from "mongoose";


import flash from "connect-flash";


import path from "path"
import { fileURLToPath } from "url";
import methodOverride from "method-override"
import Listing from "./models/listing.js";
import ejsMate from "ejs-mate";
import reviews from "./routes/review.js"
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

import ReviewRouter from "./models/review.js";
import listingsRouter from "./routes/listing.js";
import UserRouter from "./routes/user.js";

main().then(() => {
    console.log(`connection successful`);
}).catch((err) => {
    console.log("connection error");
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const sessionOptions = {
    secret: "mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.get("/", (req, res) => {
    res.send("Hi i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", ReviewRouter);
app.use("/", UserRouter);


// app.get("/testListing", async (req, res) => {

//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "calangute, Goa",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


// app.use((err, req, res, next) => {
//     res.send("Something went Wrong");
// })

app.listen(port, () => {
    console.log(`listening on port : ${port}`);
})  