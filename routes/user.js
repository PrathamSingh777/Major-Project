const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const{saveRedirectUrl} =require("../middleware.js")
const asyncwrap = require("../utils/asyncwrap.js");

const usercontroller = require("../controller/user");



router.route("/signup")
.get(usercontroller.rendersignuppage)
.post( asyncwrap (usercontroller.signup));

router.route("/login")
.get(usercontroller.renderloginform)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true})
,usercontroller.login);


//for logout ..
router.get("/logout",usercontroller.logout);

module.exports = router;