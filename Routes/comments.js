var express= require("express");
var router = express.Router();
var Campground= require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=====================
//COMMENT ROUTES
//=====================
//COMMENT FORM
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
  // find campground by ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
    }
  })   
});

//ROUTE WHERE COMMENT FORM SUBMITTED
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
  //lookup campground usind ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      //Create Comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err);
        }else{
        	//add username and id to a comment
        	comment.author.id = req.user._id;
        	comment.author.username = req.user.username;
        	//save comment 
        	comment.save();
          //add comment to campground comment array
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          req.flash("success", "Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});

//COMMENT EDIT ROUTE

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back")
    }else{
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  }); 
});
//UPDATE COMMENT AFTER EDITING
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      console.log(err);
      res.redirect("back");
    }else{
      console.log("updatedComment");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
//DELETE ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    }else{
      req.flash("success", "Comments Deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
  

module.exports = router;