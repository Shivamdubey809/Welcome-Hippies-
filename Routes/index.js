
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//=================
//ROUTES
//=================

router.get("/", function(req, res){
	res.render("landing");
});



//==============
//AUTH ROUTES
//==============
//show register form
router.get("/register", function(req,res){
  res.render("register");
});
//handle sign up logic
router.post("/register", function(req,res){
    
    User.register({username: req.body.username}, req.body.password, function(err, user){
      if(err){
        req.flash("error", err.message);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to Yelp Camp " + user.username);
        res.redirect("/campgrounds");
      });
    });
});

// show login form
router.get("/login", function(req,res){
  res.render("login");
});

//handle login logic
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"

  }), function(req,res){

});

//Logout Route
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "Logged you Out")
  res.redirect("/campgrounds");
});


module.exports = router;