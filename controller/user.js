const User = require("../models/user");

module.exports.rendersignuppage = (req,res)=>{
   res.render("users/signup.ejs")
};

module.exports.renderloginform = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
if (err){
  return next(err);
}
req.flash("success", "New user registered successfully!");
    res.redirect("/listings");
    });
    
  } catch (err) {
    console.error("Signup Error:", err);
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req,res)=>{
    req.flash( "success","welcome back to wanderlust");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });
}