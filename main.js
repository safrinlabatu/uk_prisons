var onScrollHandler = function() {
	var newImageUrl = 'img src="img/viz_1.jpg" alt=""';
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop > 100) {
     newImageUrl = 'img src="img/viz_2.jpg" alt=""'
	}
  	if (scrollTop > 200) {
     newImageUrl = 'img src="img/viz_3.jpg" alt=""'
  	}
  	if (scrollTop > 300) {
     newImageUrl = 'img src="img/viz_3.jpg" alt=""'
	}
 	'img src="img/viz_1.jpg" alt=""' = newImageUrl;
};
object.addEventListener ("scroll", onScrollHandler);