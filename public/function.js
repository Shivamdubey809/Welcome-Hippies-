


("ul").on("click", "li", function(){
	$(this).toggleClass("completed")
});

//click on X to delete a todo
$("ul").on("click","span", function(event){
     $(this).parent().fadeOut(1000, function(){
     	$(this).remove();
});
     event.stopPropagation();
});


$("input").on("keypress", function(enter){

   if(enter.which === 13){
   
   var todoText = $(this).val();
   
   $(this).val("");
   
   $("ul").append("<li><span>X</span> " + todoText +  "</li>")
}

});
