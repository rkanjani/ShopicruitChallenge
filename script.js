$(document).ready(function(){

	$("#buyify").click(function(){
		var STARTING_PAGE_INDEX = 1;
		var STARTING_PRICE = 0;
		
		var $shoppingCart = document.getElementById("shopping-cart");

		//Don't load product from JSON if already loaded
		if($shoppingCart.children.length == 0){
			getProducts(STARTING_PAGE_INDEX, STARTING_PRICE);
		}
	});

	var getProducts = function(pageIndex, price){
		var totalPrice = price;

		$.getJSON("http://shopicruit.myshopify.com/products.json?page=" + pageIndex ,function(json){

			//Break recursive call
			if(json.products.length == 0) {
				$(".total-container").text("$" + totalPrice.toFixed(2));
				return totalPrice;
			}	

			//Loops through products on apge
			json.products.forEach(function(item){

				//Only purchasing Clocks and Watches
				if(item.product_type == "Clock" || item.product_type == "Watch"){
					var product = {};
					var variants = "";
					var price = 0;
					var $container = $(".shopping-cart-container");
					var rowItem;

					//Add row element to modal containing product info
					$container.append(($container.children().length != 0 ? "<hr>" : "") + "<div class='row' id=" + item.id + "><div class='col-md-10 name'></div><div class='col-md-2 price'></div></div>"); 
					rowItem = $("#" + item.id);


					//Look through product variants and aggregate prices and titles
					item.variants.forEach(function(variant, index){
						variants += variant.title + (index != item.variants.length - 1 ? ", " : "");
						price += parseFloat(variant.price);
					});

					//Display shopping cart info
					rowItem.children(".name").text(item.title).append("<i class='variants'>" + variants + "</i>");
					rowItem.children(".price").text("$" + price.toFixed(2));

					//Summate prices of variants
					totalPrice += price;
				}
			});
			//Recursive call
			getProducts(pageIndex + 1, totalPrice);
		});
	};
});

 