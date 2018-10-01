var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    methodOverride   = require("method-override");

mongoose.connect("mongodb://localhost:27017/todo_assignment", {useNewUrlParser: true});


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var todoSchema = new mongoose.Schema({
	name : String,

});

var Todo = mongoose.model("Todo", todoSchema);

app.get("/", function(req,res){
	res.redirect("/todos");
});
app.get("/todos", function(req,res){
	res.render("index")
});

app.get("/todos/add", function(req, res){
	res.render("add");
});

app.post("/todos", function(req,res){
	var name = req.body.name;
	
	
Todo.create(name, function(err, newlyCreated){
	if(err){
		console.log(err);
	}else{
		console.log(newlyCreated);
		res.redirect("/todos");
	}
});
});




app.listen(3000, process.env.Ip, function(){
	console.log("Server Started");
});
