var onScrollHandler = function() {
	var newImageUrl = img.src;
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop > 100) {
     newImageUrl = "img/viz_2.jpg" 
	}
  	if (scrollTop > 200) {
     newImageUrl = "img/viz_3.jpg" 
  	}
  	if (scrollTop > 300) {
     newImageUrl = "img/viz_3.jpg" 
	}
 	"img/viz_1.jpg" = newImageUrl;
};
object.addEventListener ("scroll", onScrollHandler);

/* alternative */ 


