var express    = require("express");
var router     = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");



//INDEX- SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res){
	//get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		    
		}

        else{
        	res.render("Campgrounds/index", {campgrounds: allCampgrounds});
        }
	})
});

//CREATE- add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image= req.body.image;
	var desc = req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author:author}

//create a new campground and add to DB
	Campground.create(newCampground, function(err, newlyCreated){

		if(err){
			console.log(err);
		}
        else{
        	console.log(newlyCreated);
        	//redirect back to campground page
        	res.redirect("/campgrounds");
        }  
    });
});

//NEW- show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("Campgrounds/new");

});

//SHOW ROUTE- shows more info about one campground
router.get("/campgrounds/:id",function(req, res){
  //find the Campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);}
		else{
      console.log(foundCampground);
      //render show tempelate with that campground
			res.render("Campgrounds/show", {campground : foundCampground});
		}
	});
});
//EDIT ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
		})
	});

//UPDATE ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});
//DESTROY(Delete)Route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;