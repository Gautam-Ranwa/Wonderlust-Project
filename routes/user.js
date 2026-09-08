import express from "express";
const router = express.Router();
import User from "../models/user.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js"

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// router.post("/signup", async (req, res) => {
//     try {
//         let { email, username, password } = req.body;
//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);
//         console.log(registeredUser);
//         req.flash("success", "Welcome to wanderlust");
//         res.redirect("/listings");
//     } catch (e) {
//         req.flash("error", e.message);
//         res.redirect("/signup")
//     }
// })


router.post("/signup", async (req, res) => {
    try {
        let { email, username, password } = req.body;

        console.log("USERNAME:", username);
        console.log("EMAIL:", email);

        const newUser = new User({
            email,
            username
        });

        const registeredUser = await User.register(newUser, password);

        console.log("REGISTERED:", registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("listings");
        })

    } catch (e) {
        console.log("ERROR :", e);

        req.flash("error", e.message);
        res.redirect("/signup");
    }
});


// Login 

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});


router.get("/logOut", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out");
        res.redirect("/listings");
    })
})

export default router;


